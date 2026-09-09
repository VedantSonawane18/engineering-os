package in.engineeringos.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KeepAliveController {

    @GetMapping("/api/keep-alive")
    public String keepAlive() {
        return "OK";
    }
}