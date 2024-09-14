import React from "react";
import CardView from "./CardView";

export function CardList(props) {
  const { movies = [] } = props;
  return (
    <div className="card-list-container">
      {movies.length > 0 &&
        movies.map((movie) => {
          return (
            <CardView
              movie={movie}
              className=""
              //
            />
          );
        })}
    </div>
  );
}

export default CardList;
