package com.codeoftheweb.salvo;

import java.util.ArrayList;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.List;
import static java.util.stream.Collectors.toList;
import java.text.SimpleDateFormat;

@Entity
public class Salvo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private int turnNumber;
    private ArrayList<String> locations;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;


    public Salvo() { }

    public Salvo(int turnNumber, GamePlayer gamePlayer, ArrayList<String> locations) {
        this.turnNumber = turnNumber;
        this.gamePlayer = gamePlayer;
        this.locations = locations;
    }


    public long getId() { return id; }

    public int getTurnNumber() { return this.turnNumber; }

    public void setTurnNumber(int turnNumber) { this.turnNumber = turnNumber; }

    public GamePlayer getGamePlayer() { return this.gamePlayer; }

    public void setGamePlayer(GamePlayer gamePlayer) { this.gamePlayer = gamePlayer; }

    public ArrayList<String> getLocations() { return this.locations; }

    public void setLocations(ArrayList<String> locations) { this.locations = locations; }


}
