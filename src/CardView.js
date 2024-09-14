import React from "react";

export function CardView(props) {
  const { movie } = props;
  let hasAnswer = movie.hasOwnProperty("is_answer");
  let typeMovies = 'GENERIC'
  if (hasAnswer){
    typeMovies = movie.is_answer  ? 'SUITED' : 'RELATED'
  }
  const askingStyle = (data = movie) => {
    if (!(data.hasOwnProperty('is_answer'))) {
      return {
        backgroundColor : "red", 
        border: "red",
      }
    }
    return  {
      backgroundColor : movie.is_answer ?  "green" : "blue", 
      border: movie.is_answer ?  "green" : "blue",
    }
  }
  return (
    <div className="card-view" id={movie.id} style={{border: 'black'}}>
      <div className="card-header" style={askingStyle()}>
        <h4>{movie.title}</h4>
        <h5>{movie.genres ?  movie.genres : 'NO GENRES'}</h5>
        <h6>({typeMovies})</h6>
      </div>
      <div className="card-content img">
        <image style={{justifyContent: 'center'}}>NO IMAGE</image>
      </div>
      <div className="card-content card-footer">
        <h5>Released at <span>{movie.release_date}</span>. 
        Directed by <b>{movie.director}</b> with 
        average vote <span>{movie.vote_average}</span>
        </h5>
        <h5>Tagline : {movie.tagline}
        </h5>
        <h5>Keyword : {movie.keywords}
        </h5>
      </div>
    </div>
  );
}

export default CardView;
