'use client';

import styles from "./page.module.css";
import MapComponent from '@/components/map-component';
import { Typography} from "@mui/material";

export default function Home() {
  return (
    <main className={styles.main}>
        <MapComponent />
    </main>
  );
}
