package com.codeoftheweb.salvo;

import java.util.ArrayList;
import java.util.Set;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.List;
import static java.util.stream.Collectors.toList;

@Entity
public class Ship {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private String type;
    private ArrayList<String> locations;
    private ArrayList<String> hits;
    private String state;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;

    public Ship() { }

    public Ship(String type, ArrayList<String> locations, ArrayList<String> hits, String state, GamePlayer gamePlayer) {
        this.type = type;
        this.locations = locations;
        this.hits = hits;
        this.state = state;
        this.gamePlayer = gamePlayer;
    }

    public long getId() { return id; }

    public String getType() { return this.type; }

    public void setType(String type) { this.type = type; }

    public ArrayList<String> getLocations() { return this.locations; }

    public void setLocations(ArrayList<String> locations) { this.locations = locations; }

    public ArrayList<String> getHits() { return hits; }

    public void setHits(ArrayList<String> hits) { this.hits = hits; }

    public String getState() { return state;}

    public void setState(String state) { this.state = state; }

    public GamePlayer getGamePlayer() { return gamePlayer; }

    public void setGamePlayer(GamePlayer gamePlayer) { this.gamePlayer = gamePlayer; }
}
