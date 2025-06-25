import React, { useState, useRef } from "react";
import "./App.css";

const initialItems = [
  { type: "Fruit", name: "Apple" },
  { type: "Vegetable", name: "Broccoli" },
  { type: "Vegetable", name: "Mushroom" },
  { type: "Fruit", name: "Banana" },
  { type: "Vegetable", name: "Tomato" },
  { type: "Fruit", name: "Orange" },
  { type: "Fruit", name: "Mango" },
  { type: "Fruit", name: "Pineapple" },
  { type: "Vegetable", name: "Cucumber" },
  { type: "Fruit", name: "Watermelon" },
  { type: "Vegetable", name: "Carrot" },
];

export default function AutoDeleteTodoList() {
  const [mainList, setMainList] = useState(initialItems);
  const [fruitList, setFruitList] = useState([]);
  const [vegList, setVegList] = useState([]);
  const timers = useRef({});

  const handleMainClick = (item, index) => {
    // Remove from main list
    setMainList((prev) => prev.filter((_, i) => i !== index));

    const isFruit = item.type === "Fruit";
    const setList = isFruit ? setFruitList : setVegList;

    // Add to type column
    setList((prev) => [...prev, item]);

    // Set timeout to return to main list
    const id = setTimeout(() => {
      setList((prev) => {
        const stillExists = prev.find((i) => i.name === item.name);
        if (!stillExists) return prev;

        const updated = prev.filter((i) => i.name !== item.name);

        // Avoid adding duplicate to main list
        setMainList((oldMain) => {
          const already = oldMain.find((i) => i.name === item.name);
          return already ? oldMain : [...oldMain, item];
        });

        return updated;
      });
    }, 5000);

    timers.current[item.name] = id;
  };

  const handleTypeClick = (item, type) => {
    if (timers.current[item.name]) {
      clearTimeout(timers.current[item.name]);
      delete timers.current[item.name];
    }

    const setList = type === "Fruit" ? setFruitList : setVegList;
    setList((prev) => prev.filter((i) => i.name !== item));

    // Avoid duplicate return to main
    setMainList((prev) => {
      const already = prev.find((i) => i.name === item.name);
      return already ? prev : [...prev, item];
    });
  };

  return (
    <div className="container">
      <Column title="Main List">
        {mainList.map((item, index) => (
          <button
            key={`${item.name}-${index}`}
            onClick={() => handleMainClick(item, index)}
            className="item-btn"
          >
            {item.name}
          </button>
        ))}
      </Column>

      <Column title="Fruit">
        {fruitList.map((item) => (
          <button
            key={item.name}
            onClick={() => handleTypeClick(item, "Fruit")}
            className="item-btn"
          >
            {item.name}
          </button>
        ))}
      </Column>

      <Column title="Vegetable">
        {vegList.map((item) => (
          <button
            key={item.name}
            onClick={() => handleTypeClick(item, "Vegetable")}
            className="item-btn"
          >
            {item.name}
          </button>
        ))}
      </Column>
    </div>
  );
}

function Column({ title, children }) {
  return (
    <div className="column">
      <div className="column-header">{title}</div>
      <div className="column-body">{children}</div>
    </div>
  );
}
