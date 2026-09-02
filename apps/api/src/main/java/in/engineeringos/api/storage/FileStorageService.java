package in.engineeringos.api.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/*
 * Local-development storage abstraction for
 * untrusted user uploads.
 *
 * Design constraints:
 * - Only an allowlisted set of image content types
 *   is accepted.
 * - A hard file size cap is enforced independently
 *   of any servlet/multipart-level limit.
 * - The stored filename is always server-generated
 *   (UUID + a fixed extension derived from the
 *   validated content type). The client-supplied
 *   original filename is NEVER used to build a path,
 *   which rules out path traversal.
 * - Stored files live under a dedicated root that is
 *   outside the web/classpath, and are only ever
 *   served back through an authenticated, authorized
 *   controller endpoint that streams bytes — never
 *   through a static file mapping.
 *
 * This can be swapped for an S3 (or similar) backed
 * implementation later without changing callers, by
 * introducing an interface if/when a second
 * implementation is needed.
 */
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES =
        Set.of(
            "image/png",
            "image/jpeg",
            "image/webp"
        );

    private static final Map<String, String> EXTENSION_BY_CONTENT_TYPE =
        Map.of(
            "image/png", "png",
            "image/jpeg", "jpg",
            "image/webp", "webp"
        );

    private static final long MAX_FILE_SIZE_BYTES =
        5L * 1024 * 1024; // 5 MB

    private final Path root;

    public FileStorageService(
        @Value("${engineering-os.uploads.directory:./uploads}")
        String uploadsDirectory
    ) {
        this.root = Path.of(uploadsDirectory)
            .toAbsolutePath()
            .normalize();

        try {
            Files.createDirectories(root);
        } catch (IOException exception) {
            throw new IllegalStateException(
                "Unable to initialise upload storage directory.",
                exception
            );
        }
    }

    /**
     * Validates and persists an uploaded image inside
     * the given logical subdirectory (e.g. "payments").
     * Returns a storage key that can later be resolved
     * back to the file — never a filesystem path the
     * caller could manipulate.
     */
    public StoredFile store(
        String subdirectory,
        MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            throw new FileStorageException(
                "A file is required."
            );
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new FileStorageException(
                "The uploaded file exceeds the 5 MB size limit."
            );
        }

        String contentType = file.getContentType();

        if (
            contentType == null ||
            !ALLOWED_CONTENT_TYPES.contains(
                contentType.toLowerCase()
            )
        ) {
            throw new FileStorageException(
                "Only PNG, JPEG or WEBP images are accepted."
            );
        }

        String extension =
            EXTENSION_BY_CONTENT_TYPE.get(
                contentType.toLowerCase()
            );

        String safeSubdirectory =
            subdirectory.replaceAll("[^a-zA-Z0-9_-]", "");

        String generatedFilename =
            UUID.randomUUID() + "." + extension;

        String storageKey =
            safeSubdirectory + "/" + generatedFilename;

        Path targetDirectory =
            root.resolve(safeSubdirectory).normalize();

        Path targetPath =
            targetDirectory.resolve(generatedFilename)
                .normalize();

        /*
         * Defence in depth: even though the filename is
         * always server-generated, confirm the resolved
         * path is still inside the storage root before
         * writing anything to disk.
         */
        if (!targetPath.startsWith(root)) {
            throw new FileStorageException(
                "Unable to store the uploaded file."
            );
        }

        try {
            Files.createDirectories(targetDirectory);

            try (InputStream input = file.getInputStream()) {
                Files.copy(
                    input,
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
                );
            }
        } catch (IOException exception) {
            throw new FileStorageException(
                "Unable to store the uploaded file.",
                exception
            );
        }

        return new StoredFile(
            storageKey,
            contentType.toLowerCase(),
            file.getSize()
        );
    }

    /**
     * Resolves a previously stored key back to bytes.
     * The key is always one this service generated, so
     * this does not accept arbitrary client input.
     */
    public byte[] read(String storageKey) {

        Path targetPath =
            root.resolve(storageKey).normalize();

        if (!targetPath.startsWith(root)) {
            throw new FileStorageException(
                "Invalid storage key."
            );
        }

        try {
            return Files.readAllBytes(targetPath);
        } catch (IOException exception) {
            throw new FileStorageException(
                "Stored file could not be read.",
                exception
            );
        }
    }

    public void delete(String storageKey) {

        Path targetPath =
            root.resolve(storageKey).normalize();

        if (!targetPath.startsWith(root)) {
            return;
        }

        try {
            Files.deleteIfExists(targetPath);
        } catch (IOException ignored) {
            // Best-effort cleanup only.
        }
    }

    public record StoredFile(
        String storageKey,
        String contentType,
        long sizeBytes
    ) {}
}
