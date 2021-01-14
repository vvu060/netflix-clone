import React, { useState, useEffect } from 'react';
import axios from './axios';
import requests from './requests';
import "./Row.css"; 
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";


const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }){
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // A snippet of code which runs on specific conditions
    useEffect(() => {
        // if [], run once when the row loads, dont run again
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            // "https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US"
            //console.log(request.data.results);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    },[fetchUrl]);

    const opts ={
        height:"390",
        width: "100%",
        playerVars:{
            //https://developers.google.com/youtube/player_parameters
            autoplay:1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl){
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
            .then((url) =>{
                //https://www.youtube.com/watch?v=SG6zLrbAngk
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            })
            .catch((error) => console.log(error));
        }
    };

    console.log(movies);
    
    return(
        <div className="row">
            <h2>{title}</h2>
            
            <div className="row_posters">
                {/* several row poster(s)*/}
                {movies.map(movie => (
                    <img key={movie.id} onClick={() => handleClick(movie)} 
                    className={`row_poster  ${isLargeRow && "row_posterLarge"}` } 
                    src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name}/>
                 ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>} 
        </div>

    )
}


export default Row;

