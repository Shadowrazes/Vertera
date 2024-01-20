import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";

import { STATS } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Level from "../components/level";
import Loader from "./loading";

import EditIcon from "../assets/edit_icon.svg";

import {
    Form,
    Row,
    Col,
    Button,
    DropdownButton,
    Dropdown,
    Modal,
    Table,
  } from "react-bootstrap";


import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ArcElement
  } from 'chart.js';
import { Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ArcElement
  );

function Stats() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [totalData, setTotalData] = useState({});
  const [likeData, setLikeData] = useState({});
  const [tableInfo, setTableInfo] = useState({});
  const [fantasy, setFantasy] = useState({});

  const { loading, error, data, refetch } = useQuery(STATS);
  const getCurrentUserStats = () => {
    return data?.helperStatList.filter((elem) => {
        return elem.helper.id == user.id;
    })
  }

  const getAvgReplyTimeAllUsers = () => {
    let avg = 0;
    data?.helperStatList.forEach((elem) => {
        avg += elem.stats.avgReplyTime;
    })
    return avg / data?.helperStatList.length;
  }

  const getStatCoefs = (stat) => {
    if(stat?.totalTickets == 0) {
        return {
            likeDislikeCoef: 10,
            avgReplyTimeCoef: 10,
            effTicketsCoef: 10
        }
    }

    let result =  {
        likeDislikeCoef: Math.round(stat?.likes / (stat?.likes + stat?.dislikes) * 100),
        avgReplyTimeCoef: Math.round((1 - (stat?.avgReplyTime < 1 ? stat?.avgReplyTime : 1)) * 100),
        effTicketsCoef: Math.round((1 - stat?.inProgressTickets / stat?.totalTickets) * 100)
    };

    result.likeDislikeCoef = Math.max(result.likeDislikeCoef, 10);
    result.avgReplyTimeCoef = Math.max(result.avgReplyTimeCoef, 10);
    result.effTicketsCoef = Math.max(result.effTicketsCoef, 10);

    return result;
  }

  const getAvgStatCoefs = (allUserData) => {
    let allCoefs = [];
    allUserData?.helperStatList.forEach((userData) => {
        allCoefs.push(getStatCoefs(userData.stats));
    })

    let result = {
        likeDislikeCoef: 0,
        avgReplyTimeCoef: 0,
        effTicketsCoef: 0
    }

    allCoefs.forEach((elem) => {
        result.likeDislikeCoef += elem.likeDislikeCoef;
        result.avgReplyTimeCoef += elem.avgReplyTimeCoef;
        result.effTicketsCoef += elem.effTicketsCoef;
    });

    result.likeDislikeCoef /= allCoefs.length;
    result.avgReplyTimeCoef /= allCoefs.length;
    result.effTicketsCoef /= allCoefs.length;

    return result;
  }

  const getTime = (sourceHource) => {
    let hours = Math.round(sourceHource);
    let minutes = Math.round(sourceHource * 60) % 60;
    let seconds = Math.round(sourceHource * 60 * 60) % 60;
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
  }

  useEffect(() => {
   
    let currentStats = getCurrentUserStats();
    if(currentStats) {
        currentStats = currentStats[0].stats;
    }

    let avgReplyTimeAllUsers = getAvgReplyTimeAllUsers();

    setLikeData({
        labels: ['Положительные', 'Отрицательные', 'Неоценённые'],
        datasets: [
            {
                backgroundColor: ['rgba(71, 225, 167, 0.5)', 'rgba(194, 116, 161, 0.5)', 'rgba(146,207,251, 1)'],
                data: [currentStats?.likes, currentStats?.dislikes, currentStats?.notRated]
            },
        ]
    })
    

    

    let coefs = getStatCoefs(currentStats);
    let avgCoefs = getAvgStatCoefs(data);

    
    setTotalData({
        labels: ['Положительные отзывы', 'Средняя скорость ответа', 'Эффективность'],
        datasets: [
            {
                label: 'Моя статистика',
                backgroundColor: ['#EBE0FF88'],
                data: [coefs.likeDislikeCoef, coefs.avgReplyTimeCoef, coefs.effTicketsCoef]
            },
            {
                label: 'Средние значения',
                backgroundColor: ['#D1FDD6'],
                data: [avgCoefs.likeDislikeCoef, avgCoefs.avgReplyTimeCoef, avgCoefs.effTicketsCoef]
            },
        ]
    })

    let time = getTime(currentStats?.avgReplyTime);
    setTableInfo([
        {
            name: "Всего тикетов",
            value: currentStats?.totalTickets,
        },
        {
            name: "Закрытых тикетов",
            value: currentStats?.closedTickets,
        },
        {
            name: "Тикетов в работе",
            value: currentStats?.inProgressTickets,
        },
        {
            name: "Положительных отзывов",
            value: currentStats?.likes,
        },
        {
            name: "Отрицательных отзывов",
            value: currentStats?.dislikes,
        },
        {
            name: "Среднее время ответа",
            value: time.hours + 'ч. ' + time.minutes + "мин. " + time.seconds + "сек.",
        },
    ])

    setFantasy(currentStats?.fantasy);

  }, [data])

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  return (
    <>
      <TitleH2 title="Статистика" className="title__heading" />
      <Row>
        <Col>
        <Table striped bordered hover>
            <thead>
                <tr>
                <th colSpan={2}>Общая информация</th>
                </tr>
            </thead>
            <tbody>
                {tableInfo.map((elem, index) => (
                    <tr key={index}>
                        <td>{elem.name}</td>
                        <td>{elem.value}</td>
                    </tr>
                ))}
            </tbody>
            </Table>
        </Col>
      </Row>
      <Row>
        <Col>
            <Level fantasy={fantasy}/>
        </Col>
      </Row>
      <Row>
        <Col>
            <Radar data={totalData} options={{ 
                    responsive: true ,
                    scales: {
                        r: {
                        beginAtZero: true,
                    },
                    }} 
                }
            />
        </Col>
        <Col>
            <Doughnut data={likeData} options={{ responsive: true }} />
        </Col>
      </Row>
    </>
  );
}

export default Stats;
