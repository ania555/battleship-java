package com.codeoftheweb.salvo;

import java.util.ArrayList;
import java.util.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import static java.util.Arrays.asList;


@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);

		System.out.println("Hello");
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository,
									  GameRepository gameRepository,
									  GamePlayerRepository gamePlayerRepository,
									  ShipRepository shipRepository,
									  SalvoRepository salvoRepository,
									  ScoreRepository scoreRepository) {
		return (args) -> {
			Player p1 = new Player("j.bauer@ctu.gov", "24");
			Player p2 = new Player("c.obrian@ctu.gov", "42");
			Player p3 = new Player("t.almeida@ctu.gov", "mole");
			Player p4 = new Player("d.palmer@whitehouse.gov", "palmer");

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

			GamePlayer GP1 = new GamePlayer(g1, p1);
			GamePlayer GP2 = new GamePlayer(g1, p2);
			GamePlayer GP3 = new GamePlayer(g2, p1);
			GamePlayer GP4 = new GamePlayer(g2, p2);
			GamePlayer GP5 = new GamePlayer(g3, p2);
			GamePlayer GP6 = new GamePlayer(g3, p3);
			GamePlayer GP7 = new GamePlayer(g4, p1);
			GamePlayer GP8 = new GamePlayer(g4, p2);
			GamePlayer GP9 = new GamePlayer(g5, p3);
			GamePlayer GP10 = new GamePlayer(g5, p1);
			GamePlayer GP11 = new GamePlayer(g6, p4);

			gamePlayerRepository.save(GP1);
			gamePlayerRepository.save(GP2);
			gamePlayerRepository.save(GP3);
			gamePlayerRepository.save(GP4);
			gamePlayerRepository.save(GP5);
			gamePlayerRepository.save(GP6);
			gamePlayerRepository.save(GP7);
			gamePlayerRepository.save(GP8);
			gamePlayerRepository.save(GP9);
			gamePlayerRepository.save(GP10);
			gamePlayerRepository.save(GP11);

			Ship S1 = new Ship("Aircraft Carrier", new ArrayList<String>(asList("B5", "B6", "B7", "B8", "B9")), GP1);
			Ship S2 = new Ship("Battleship", new ArrayList<String>(asList("D4", "D5", "D6", "D7")) , GP1);
			Ship S3 = new Ship("Submarine", new ArrayList<String>(asList("F3", "G3", "H3")) , GP1);
			Ship S4 = new Ship("Destroyer", new ArrayList<String>(asList("F5", "G5", "H5")) , GP1);
			Ship S5 = new Ship("Patrol Boat", new ArrayList<String>(asList("I8", "I9")) , GP1);

			Ship S11 = new Ship("Aircraft Carrier", new ArrayList<String>(asList("C2", "C3", "C4", "C5", "C6")) , GP2);
			Ship S12 = new Ship("Battleship", new ArrayList<String>(asList("E2", "E3", "E4", "E5")) , GP2);
			Ship S13 = new Ship("Submarine", new ArrayList<String>(asList("G2", "H2", "I2")) , GP2);
			Ship S14 = new Ship("Destroyer", new ArrayList<String>(asList("G7", "G8", "G9")) , GP2);
			Ship S15 = new Ship("Patrol Boat", new ArrayList<String>(asList("J9", "J10")) , GP2);

			shipRepository.save(S1);
			shipRepository.save(S2);
			shipRepository.save(S3);
			shipRepository.save(S4);
			shipRepository.save(S5);
			shipRepository.save(S11);
			shipRepository.save(S12);
			shipRepository.save(S13);
			shipRepository.save(S14);
			shipRepository.save(S15);

			Salvo Sav1 = new Salvo(1, GP1, new ArrayList<String>(asList("A9", "A10")));
			Salvo Sav2 = new Salvo(2, GP1, new ArrayList<String>(asList("B7", "B8")));
			Salvo Sav3 = new Salvo(3, GP1, new ArrayList<String>(asList("C1", "C2")));
			Salvo Sav4 = new Salvo(4, GP1, new ArrayList<String>(asList("E5", "E6")));
			Salvo Sav5 = new Salvo(5, GP1, new ArrayList<String>(asList("G3", "G4")));

			Salvo Sav11 = new Salvo(1, GP2, new ArrayList<String>(asList("D9", "D10")));
			Salvo Sav12 = new Salvo(2, GP2, new ArrayList<String>(asList("F5", "F6")));
			Salvo Sav13 = new Salvo(3, GP2, new ArrayList<String>(asList("H3", "H4")));
			Salvo Sav14 = new Salvo(4, GP2, new ArrayList<String>(asList("I1", "I2")));
			Salvo Sav15 = new Salvo(5, GP2, new ArrayList<String>(asList("J7", "J8")));

			salvoRepository.save(Sav1);
			salvoRepository.save(Sav2);
			salvoRepository.save(Sav3);
			salvoRepository.save(Sav4);
			salvoRepository.save(Sav5);
			salvoRepository.save(Sav11);
			salvoRepository.save(Sav12);
			salvoRepository.save(Sav13);
			salvoRepository.save(Sav14);
			salvoRepository.save(Sav15);

			Score score1 = new Score(new Date(), "won", p1, g1);
			Score score2 = new Score(new Date(), "lost", p2, g1);

			Score score3 = new Score(new Date(), "tied", p1, g2);
			Score score4 = new Score(new Date(), "tied", p2, g2);

			Score score5 = new Score(new Date(), "lost", p2, g3);
			Score score6 = new Score(new Date(), "won", p3, g3);

			Score score7 = new Score(new Date(), "tied", p1, g4);
			Score score8 = new Score(new Date(), "tied", p2, g4);

			Score score9 = new Score(new Date(), "tied", p3, g5);
			Score score10 = new Score(new Date(), "tied", p1, g5);

			scoreRepository.save(score1);
			scoreRepository.save(score2);
			scoreRepository.save(score3);
			scoreRepository.save(score4);
			scoreRepository.save(score5);
			scoreRepository.save(score6);
			scoreRepository.save(score7);
			scoreRepository.save(score8);
			scoreRepository.save(score9);
			scoreRepository.save(score10);
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

