package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import static java.util.stream.Collectors.toList;

@Entity
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private Date finishDate;
    private String result;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player;

    public Score() { }

    public Score(Date finishDate, String result, Player player, Game game) {
        this.finishDate = finishDate;
        this.result = result;
        this.player = player;
        this.game = game;
    }

    public long getId() { return id; }

    public Date getFinishDate() { return this.finishDate; }

    public void setFinishDate(Date finishDate) { this.finishDate = finishDate; }

    public String getResult() { return this.result; }

    public void setResult(String result) { this.result = result; }

    public Player getPlayer() { return this.player; }

    public void setPlayer(Player player) { this.player = player; }

    public Game getGame() { return this.game; }

    public void setGame(Game game) { this.game = game; }
}
