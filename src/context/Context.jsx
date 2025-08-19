import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recent, setRecent] = useState("");
  const [prev, setPrev] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const delayPara = (index, word) => {
    setTimeout(() => {
      setResult((prev) => prev + word);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  }

  const onSend = async (prompt) => {
    setResult("");
    setLoading(true);
    setShowResult(true);
    setInput(prompt);
    setRecent(prompt);
    if (!prev.includes(prompt)) setPrev([prompt, ...prev]);
    const res = await runChat(prompt);
    const resArray = res.split("**");
    let newRes = "";
    for (let i = 0; i < resArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newRes += resArray[i];
      } else {
        newRes += `<b>${resArray[i]}</b>`;
      }
    }
    let newRes2 = newRes.split("*").join("<br>");
    let newResArray = newRes2.split(" ");
    console.log(newResArray, "resa");
    for (let i = 0; i < newResArray.length; i++) {
      delayPara(i, newResArray[i] + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    input,
    setInput,
    recent,
    setRecent,
    prev,
    setPrev,
    showResult,
    setShowResult,
    loading,
    setLoading,
    result,
    setResult,
    onSend,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
