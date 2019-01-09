package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);

		System.out.println("Hello");
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository repository) {
		return (args) -> {
			// save a couple of players
			repository.save(new Player("aaa@a.de"));
			repository.save(new Player("bbb@b.pl"));
			repository.save(new Player("ccc@c.de"));
			repository.save(new Player("ddd@d.de"));
			repository.save(new Player("eee@e.de"));
		};
	}

}

