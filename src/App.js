import React, { useEffect, useState } from "react";
import Tmdb from "./Tmdb";
import MovieRow from "./Components/MovieRow";
import "./App.scss";
import FeaturedMovie from "./Components/FeaturedMovie";
import Header from "./Components/Header/Header";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      //Pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //Pegando o featured
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * originals[0].items.results.length - 1
      );
      let chosen = originals[0].items.results[randomChosen];
      console.log(chosen);
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      console.log(chosenInfo);
      setFeatureData(chosenInfo);
    };
    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };
    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featureData && <FeaturedMovie item={featureData} />}
      <section className="lists">
        {movieList.map((movies, key) => (
          <MovieRow key={key} title={movies.title} items={movies.items} />
        ))}
      </section>
      <footer>
        Feito com
        <span role="img" aria-label="coração">
          ❤️
        </span>
        pela B7Web <br />
        Direitos de imagem para Netflix
        <br />
        Dados pegos do site Themoviedb.org
      </footer>
      {movieList.length <= 0 && (
        <div className="loading">
          <img
            src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif"
            alt="Carregando"
          />
        </div>
      )}
    </div>
  );
}

export default App;
