"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async()=>{
       const response  =  await  fetch('/user');
       if(!response.ok){
         throw  new Error("Network  response is not ok");
       }
       return response.json();
    },
  });

  console.log("data", query);
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}></div>
    </main>
  );
}
