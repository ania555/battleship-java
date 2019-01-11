package com.codeoftheweb.salvo;

import java.util.Date;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource
public interface GameRepository extends JpaRepository<Game, Long>{
    List<Game> findByCreationDate(Date creationDate);
}
