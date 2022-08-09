import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Script from "next/script";
import { attributes, react as HomeContent } from "../content/home.md";

const Home: NextPage = () => {
  let { title, cats } = attributes;
  return (
    <>
      {/* <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></Script> */}
      <article>
        <h1>{title}</h1>
        <HomeContent />
        <ul>
          {cats.map((cat: any, k: number) => (
            <li key={k}>
              <h2>{cat.name}</h2>
              <p>{cat.description}</p>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
};

export default Home;
