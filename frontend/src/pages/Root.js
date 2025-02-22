import {
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import MainNavigation from "../components/MainNavigation";
import { useEffect, useState } from "react";
import { getTokenDuration } from "../util/auth";

function RootLayout() {
  const token = useLoaderData();
  const submit = useSubmit();
  const [time, setTime] = useState({
    minutes: 0,
    seconds: 0,
  });

  let timeStyle = {
    minutes: {
      color: "green",
    },
    seconds: {
      color: "green",
    },
  };

  if (time.minutes < 30 && time.minutes >= 10) {
    timeStyle.minutes.color = "yellow";
  } else if (time.minutes < 10) {
    timeStyle.minutes.color = "red";
  } else {
    timeStyle.minutes.color = "green";
  }

  if (time.seconds < 30 && time.seconds >= 10) {
    timeStyle.seconds.color = "yellow";
  } else if (time.seconds < 10) {
    timeStyle.seconds.color = "red";
  } else {
    timeStyle.seconds.color = "green";
  }

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "POST" });
      return;
    }
    const tokenDuration = getTokenDuration();

    const durationTimer = setTimeout(() => {
      submit(null, { action: "/logout", method: "POST" });
    }, tokenDuration);

    const durationInterval = setInterval(() => {
      const tokenDuration = getTokenDuration();
      const minutes = Math.floor(tokenDuration / 60000);
      const seconds = Math.floor((tokenDuration % 60000) / 1000);

      setTime((prevTime) => {
        return {
          ...prevTime,
          minutes,
          seconds,
        };
      });

      console.log(`token duration: ${minutes}:${seconds} "minutes:seconds"`);
    }, 1000);

    return () => {
      clearTimeout(durationTimer);
      clearInterval(durationInterval);
    };
  }, [token, submit]);

  return (
    <>
      <MainNavigation />
      <main>
        <p style={{ textAlign: "center" }}>
          <span
            style={{
              color: timeStyle.minutes.color,
              fontSize: "5rem",
              fontFamily: "cursive",
            }}
          >
            {time.minutes}
          </span>
          <span
            style={{
              color: timeStyle.seconds.color,
              fontSize: "3rem",
              fontFamily: "cursive",
            }}
          >
            :{time.seconds}
          </span>
        </p>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
