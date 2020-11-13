import React, { useState, useEffect, useCallback } from "react";
import "./assets/styles/style.css";
import { AnswersList, Chats } from "./Components/index";
import FormDialog from "./Components/Forms/FormDialog";
import { db } from "./firebase/index";

const App = () => {
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState("init");
  const [dataSet, setDataset] = useState([]);
  const [open, setOpen] = useState(false);

  //　次の解答を表示
  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: "question",
    });

    setAnswers(nextDataset.answers);
    setCurrentId(nextQuestionId);
  };

  const selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch (true) {
      case nextQuestionId === "contact":
        handleClickOpen();
        break;
      case /^https:*/.test(nextQuestionId):
        const a = document.createElement("a");
        a.href = nextQuestionId;
        a.target = "_blank";
        a.click();
        break;
      default:
        addChats({
          text: selectedAnswer,
          type: "answer",
        });

        setTimeout(
          () => displayNextQuestion(nextQuestionId, dataSet[nextQuestionId]),
          1000
        );
        break;
    }
  };

  // 前回分までのchatステータスと、新規ステータスのオブジェクトをマージした新しいオブジェクトをsetStateとして渡す
  const addChats = (chat) => {
    setChats((prevChat) => {
      return [...prevChat, chat];
    });
  };

  // componentDidMount
  // 第二引数に配列を指定して、一度しか実行しないようにする。
  useEffect(() => {
    (async () => {
      const initDataset = {};
      await db
        .collection("questions")
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            const id = doc.id;
            const data = doc.data();
            initDataset[id] = data;
          });
        });
      setDataset(initDataset);
      // setDataseが完了するまでに多少ラグが発生するので
      // initDatasetをdisplayNext~の引数として渡すことで
      // desplayNe~がsetDatasetが完了するまで実行できないように制御している
      displayNextQuestion(currentId, initDataset[currentId]);
    })();
  }, []);

  // componentDidUpdate
  // 第二引数は何も指定してない
  useEffect(() => {
    const scrollArea = document.getElementById("scroll-area");
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  });

  // 子コンポーネントに渡していないので関数をuseCallback化する必要はない
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList answers={answers} select={selectAnswer} />
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
};

export default App;
