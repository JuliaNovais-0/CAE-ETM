package br.com.cae.etm.controllers.v1;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class IndexController {

    @GetMapping("/")
    public ResponseEntity<String> getIndex() {
        return ResponseEntity.ok("Você acessou a rota correta");
    }
}
    
