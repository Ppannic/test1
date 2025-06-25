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

  const moveToMainList = (item, setList) => {
    // หยุด timer ถ้ามี
    if (timers.current[item.name]) {
      clearTimeout(timers.current[item.name]);
      delete timers.current[item.name];
    }

    setList((prev) => prev.filter((i) => i.name !== item.name));

    setMainList((prev) => {
      const already = prev.find((i) => i.name === item.name);
      return already ? prev : [...prev, item];
    });
  };

  const handleMainClick = (item, index) => {
    setMainList((prev) => prev.filter((_, i) => i !== index));
    const setList = item.type === "Fruit" ? setFruitList : setVegList;
    setList((prev) => [...prev, item]);

    // ตั้งเวลาให้กลับ
    const id = setTimeout(() => {
      moveToMainList(item, setList);
    }, 5000);
    timers.current[item.name] = id;
  };

  const handleCategoryClick = (item, type) => {
    const setList = type === "Fruit" ? setFruitList : setVegList;
    moveToMainList(item, setList);
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
            onClick={() => handleCategoryClick(item, "Fruit")}
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
            onClick={() => handleCategoryClick(item, "Vegetable")}
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
