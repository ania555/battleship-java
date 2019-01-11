package com.codeoftheweb.salvo;

import java.util.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
	public CommandLineRunner initData(PlayerRepository playerRepository,
									  GameRepository gameRepository,
									  GamePlayerRepository gamePlayerRepository) {
		return (args) -> {
			Player p1 = new Player("j.bauer@ctu.gov");
			Player p2 = new Player("c.obrian@ctu.gov");
			Player p3 = new Player("t.almeida@ctu.gov");
			Player p4 = new Player("d.palmer@whitehouse.gov");

			playerRepository.save(p1);
			playerRepository.save(p2);
			playerRepository.save(p3);
			playerRepository.save(p4);

			Game g1 = new Game(new Date());
			Game g2 = new Game(new Date());
			Game g3 = new Game(new Date());
			Game g4 = new Game(new Date());
			Game g5 = new Game(new Date());
			Game g6 = new Game(new Date());

			gameRepository.save(g1);
			gameRepository.save(g2);
			gameRepository.save(g3);
			gameRepository.save(g4);
			gameRepository.save(g5);
			gameRepository.save(g6);

			gamePlayerRepository.save(new GamePlayer(new Date(), g1, p1));
			gamePlayerRepository.save(new GamePlayer(new Date(), g1, p2));
			gamePlayerRepository.save(new GamePlayer(new Date(), g2, p1));
			gamePlayerRepository.save(new GamePlayer(new Date(), g2, p2));
			gamePlayerRepository.save(new GamePlayer(new Date(), g3, p2));
			gamePlayerRepository.save(new GamePlayer(new Date(), g3, p3));
			gamePlayerRepository.save(new GamePlayer(new Date(), g4, p1));
			gamePlayerRepository.save(new GamePlayer(new Date(), g4, p2));
			gamePlayerRepository.save(new GamePlayer(new Date(), g5, p3));
			gamePlayerRepository.save(new GamePlayer(new Date(), g5, p1));
			gamePlayerRepository.save(new GamePlayer(new Date(), g6, p4));

		};
	}

	/*public CommandLineRunner initData(GameRepository repository) {
		return (args) -> {
			repository.save(new Game(new Date()));
			repository.save(new Game(Date.from(new Date().toInstant().plusSeconds(3600))));
			repository.save(new Game(Date.from(new Date().toInstant().plusSeconds(7200))));
		};
	}*/

	/*public CommandLineRunner initData(PlayerRepository repository) {
		return (args) -> {
			// save a couple of players
			repository.save(new Player("aaa@a.de"));
			repository.save(new Player("bbb@b.pl"));
			repository.save(new Player("ccc@c.de"));
			repository.save(new Player("ddd@d.de"));
			repository.save(new Player("eee@e.de"));
		};
	}*/

}

