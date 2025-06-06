import React from "react";
import './Header.css'

export default function Header(){

  return(
    <header className="home-header">
        <div className="icon">
          <p className="icon__text"> prodoDO</p>
        </div>
        <div className="add-friend-conteiner">
          <input className="add-frinend__input"></input>
          <button className="add-friend__btn">Lj,f</button>
        </div>
    </header>
  )
}