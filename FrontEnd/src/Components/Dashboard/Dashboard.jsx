import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import "./Dashboard.css";
import { assets } from "../../assets/assets";
import Charts from "./Charts/Charts";
import DashboardHeader from "../DashBoardHeader/DashBoardHeader";
import Cards from "./Cards/Cards";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AdminContext } from "../../Context/AdminContext";

const Dashboard = () => {
  const { stats, fetchDashboardStats, type } = useContext(AdminContext);
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const salesCardContent = useMemo(
    () => (
      <div className="card">
        <h3>Sales Overview</h3>
        <div className="card-row">
          <div className="card-item">
            <img src={assets.Sales} alt="Sales" />
            <p>₹ {stats?.salesOverview?.salesCount?.toLocaleString()} Sales</p>
          </div>
          <div className="card-item">
            <img src={assets.Revenue} alt="Revenue" />
            <p>₹ {stats?.salesOverview?.revenue?.toLocaleString()} Revenue</p>
          </div>
          <div className="card-item">
            <img src={assets.Profit} alt="Profit" />
            <p>₹ {stats?.salesOverview?.profit?.toLocaleString()} Profit</p>
          </div>
          <div className="card-item">
            <img src={assets.Cost} alt="Cost" />
            <p>₹ {stats?.salesOverview?.cost?.toLocaleString()} Cost</p>
          </div>
        </div>
      </div>
    ),
    [stats]
  );

  const purchaseCardContent = useMemo(
    () => (
      <div className="card">
        <h3>Purchase Overview</h3>
        <div className="card-row">
          <div className="card-item">
            <img src={assets.Purchase} alt="Purchase" />
            <p>{stats?.purchaseOverview?.purchaseCount} Purchase</p>
          </div>
          <div className="card-item">
            <img src={assets.Cost} alt="Cost" />
            <p>₹ {stats?.purchaseOverview?.cost?.toLocaleString()} Cost</p>
          </div>
          <div className="card-item">
            <img src={assets.Cancel} alt="Cancel" />
            <p>{stats?.purchaseOverview?.canceledOrders} Cancel</p>
          </div>
          <div className="card-item">
            <img src={assets.Profit} alt="Return" />
            <p>₹ {stats?.purchaseOverview?.returns?.toLocaleString()} Return</p>
          </div>
        </div>
      </div>
    ),
    [stats]
  );

  const chartCardContent = useMemo(
    () => (
      <div className="card chart-card">
        <div className="chart-header">
          <h3>Sales & Purchase</h3>
        </div>
        <div className="chart-placeholder">
          <Charts width="100%" height={300} />
        </div>
      </div>
    ),
    []
  );

  const inventoryCardContent = useMemo(
    () => (
      <div className="card">
        <h3>Inventory Summary</h3>
        <div className="card-row">
          <div className="card-item">
            <img src={assets.Quantity} alt="Quantity" />
            <p>
              {stats?.inventorySummary?.quantityInHand?.toLocaleString()}{" "}
              Quantity in Hand
            </p>
          </div>
          <div className="card-item">
            <img src={assets.way} alt="To be received" />
            <p>
              {stats?.inventorySummary?.toBeReceived?.toLocaleString()} To be
              received
            </p>
          </div>
        </div>
      </div>
    ),
    [stats]
  );

  const productCardContent = useMemo(
    () => (
      <div className="card">
        <h3>Product Summary</h3>
        <div className="card-row">
          <div className="card-item">
            <img src={assets.Suppliers} alt="Suppliers" />
            <p>{stats?.productSummary?.suppliers} Number of Suppliers</p>
          </div>
          <div className="card-item">
            <img src={assets.Quantity} alt="Categories" />
            <p>{stats?.productSummary?.categories} Number of Categories</p>
          </div>
        </div>
      </div>
    ),
    [stats]
  );

  const [leftCards, setLeftCards] = useState([
    { id: "sales", content: salesCardContent },
    { id: "purchase", content: purchaseCardContent },
    { id: "chart", content: chartCardContent },
  ]);

  const [rightCards, setRightCards] = useState([
    { id: "inventory", content: inventoryCardContent },
    { id: "product", content: productCardContent },
    { id: "cards", content: <Cards maxheight={300} /> },
  ]);

  useEffect(() => {
    setLeftCards((prev) => [
      { ...prev[0], content: salesCardContent },
      { ...prev[1], content: purchaseCardContent },
      prev[2], // chart card doesn't depend on stats
    ]);

    setRightCards((prev) => [
      { ...prev[0], content: inventoryCardContent },
      { ...prev[1], content: productCardContent },
      prev[2], // cards component
    ]);
  }, [
    salesCardContent,
    purchaseCardContent,
    inventoryCardContent,
    productCardContent,
  ]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === "left" && destination.droppableId === "left") {
      setLeftCards((prev) => {
        const reordered = Array.from(prev);
        const [moved] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, moved);
        return reordered;
      });
    }

    if (source.droppableId === "right" && destination.droppableId === "right") {
      setRightCards((prev) => {
        const reordered = Array.from(prev);
        const [moved] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, moved);
        return reordered;
      });
    }
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardHeader title="Home" showSearch={false} />
      <hr />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="dashboard-content">
          <Droppable droppableId="left">
            {(provided) => (
              <div
                className="dashboard-left"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {leftCards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {card.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="right">
            {(provided) => (
              <div
                className="dashboard-right"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {rightCards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {card.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default React.memo(Dashboard);
