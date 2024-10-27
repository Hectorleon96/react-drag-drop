import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "DRAG AND DROP WITH REACT" },
    { name: "description", content: "Drag and drop with react!" },
  ];
};

type Card = {
  id: number;
  text: string;
};

export default function App() {
  return (
    <div className="max-w-96 mx-auto">
      <h1>DRAG AND DROP WITH REACT</h1>
      <CardsForDrag />
      <DropContainer />
    </div>
  );
}

function CardsForDrag() {
  const cards = [
    { id: 1, text: "element 1" },
    { id: 2, text: "element 2" },
    { id: 3, text: "element 3" },
  ];

  function handleOnDrag(e: React.DragEvent, card: Card) {
    e.dataTransfer.setData("card", JSON.stringify(card));
  }

  return (
    <ul className="grid md:grid-cols-3 gap-2 mt-4">
      {cards.map((card) => (
        <li
          key={card.id}
          draggable
          onDragStart={(e) => handleOnDrag(e, card)}
          className="text-center shadow bg-slate-300 rounded hover:opacity-80 cursor-move"
        >
          {card.text}
        </li>
      ))}
    </ul>
  );
}

function DropContainer() {
  const [cards, setCards] = useState<Card[]>([]);

  function handleOnDrop(e: React.DragEvent) {
    const card = e.dataTransfer.getData("card");
    const newCard = JSON.parse(card) as Card;
    setCards((currentCards) => [...currentCards, newCard]);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function onDeleteCard(card: Card) {
    setCards((current) => current.filter((current) => current.id !== card.id));
  }

  return (
    <div onDrop={handleOnDrop} onDragOver={handleDragOver} className="rounded">
      <CardsGrid cards={cards} onDeleteCard={onDeleteCard} />
    </div>
  );
}

function CardsGrid({
  cards,
  onDeleteCard,
}: {
  cards: Card[];
  onDeleteCard: (card: Card) => void;
}) {
  return (
    <ul className="grid gap-y-4 mt-6 p-4 rounded shadow bg-gray-50">
      {cards.map((card) => (
        <CardsGridItem key={card.id} card={card} onDeleteCard={onDeleteCard} />
      ))}
    </ul>
  );
}

function CardsGridItem({
  card,
  onDeleteCard,
}: {
  card: Card;
  onDeleteCard: (card: Card) => void;
}) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  function toggleShowMenu() {
    setShowMenu((current) => !current);
  }

  return (
    <li
      id={String(card.id)}
      className="flex items-center justify-between py-4 shadow bg-slate-300 rounded hover:opacity-80"
    >
      {card.text}
      <button onClick={toggleShowMenu}>...</button>

      {showMenu && (
        <CardGridItemMenu cardForDelete={card} onDeleteCard={onDeleteCard} />
      )}
    </li>
  );
}

function CardGridItemMenu({
  onDeleteCard,
  cardForDelete,
}: {
  cardForDelete: Card;
  onDeleteCard: (card: Card) => void;
}) {
  const [showConfirmAction, setShowConfirmaAction] = useState<boolean>(false);

  function toggleShowConfirmAction() {
    setShowConfirmaAction((current) => !current);
  }

  return (
    <div>
      <button
        onClick={toggleShowConfirmAction}
        aria-label="delete card"
        title={`delete card ${cardForDelete.text}`}
      >
        Delete
      </button>
      {showConfirmAction && (
        <div className="grid grid-cols-2 gap-x-4 p-2 rounded">
          <button
            onClick={toggleShowConfirmAction}
            aria-label="close delete menu"
          >
            Cancel
          </button>
          <button
            onClick={() => onDeleteCard(cardForDelete)}
            aria-label={`delete card ${cardForDelete.text}`}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
