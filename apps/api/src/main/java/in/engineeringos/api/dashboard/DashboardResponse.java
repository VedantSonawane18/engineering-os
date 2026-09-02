package in.engineeringos.api.dashboard;

import in.engineeringos.api.user.User;

public record DashboardResponse(
    UserSummary user,
    ApprovalSummary approval,
    AcademicSummary academic,
    TechnologySummary technology,
    QuerySummary queries,
    TicketSummary tickets
) {

    public record UserSummary(
        String id,
        String fullName,
        String email,
        String role
    ) {}

    public record ApprovalSummary(
        String status
    ) {}

    public record AcademicSummary(
        boolean configured
    ) {}

    public record TechnologySummary(
        boolean configured
    ) {}

    public record QuerySummary(
        int open
    ) {}

    public record TicketSummary(
        int open
    ) {}

    public static DashboardResponse from(
        User user,
        long openTickets
    ) {

        int normalizedOpenTickets =
            Math.toIntExact(openTickets);

        return new DashboardResponse(
            new UserSummary(
                user.getId().toString(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
            ),
            new ApprovalSummary(
                user.getApprovalStatus().name()
            ),
            new AcademicSummary(false),
            new TechnologySummary(false),
            new QuerySummary(
                normalizedOpenTickets
            ),
            new TicketSummary(
                normalizedOpenTickets
            )
        );
    }

    /*
     * Retained for compatibility with any existing
     * callers that still construct a dashboard without
     * live ticket counts.
     */
    public static DashboardResponse from(
        User user
    ) {
        return from(user, 0);
    }
}