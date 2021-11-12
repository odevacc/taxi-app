import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Divider, Input, Layout, Typography, Button, Col, Row, message, notification } from "antd";
import { Map, Placemark, YMaps, ZoomControl } from "react-yandex-maps";
import s from "./App.module.css";
import CarsCard from "./Cards/CarsCard";
import ClosestCar from "./Cards/ClosestCar";
import { mockCar } from "../utils/Cars";

const { Content } = Layout;
const { Title } = Typography;

export type Cars = typeof mockCar;

const App: React.FC = () => {
  const [coords, setCoords] = useState<Array<number>>([]);
  const [cars, setCars] = useState<Cars>(mockCar);
  const [sorted, setSorted] = useState<Cars>([]);
  const [ymaps, setYmaps] = useState<any>();
  const [values, setValues] = useState("");

  const YmapsControl = (ymap: any) => {
    !ymaps && setYmaps(ymap);
    const searchControl = new ymap.control.SearchControl({
      options: {
        provider: "yandex#map",
      },
    });

    const suggestView = new ymap.SuggestView("suggest");

    suggestView.events.add("select", (e: any) => {
      searchControl
        .search(e.get("item").value)
        .then((data: any) => {
          const sugCoords = data.geoObjects.get(0).geometry.getCoordinates();
          const sugAddress = data.geoObjects.get(0).getAddressLine();
          setCoords(sugCoords);
          setValues(sugAddress);
        })
        .catch((e: any) => console.log("e", e));
    });
  };

  const onMapClick = (e: any) => {
    let freshCoords = e.get("coords");
    setCoords(freshCoords);
    getAddress(freshCoords);
  };

  const getAddress = (coords: Array<number>) => {
    ymaps
      .geocode(coords)
      .then((result: any) =>
        setValues(result.geoObjects.get(0).getAddressLine())
      );
  };

  const onChange = (e: any) => {
    let freshValues = e.target.value;
    setValues(freshValues);
  };

  const handleClick = () => {
    let data = {source_time: new Date(Date.now()).toISOString(),
      addresses: [{
        address: values,
        lat: coords[0],
        lon: coords[1]
      }],
      crew_id: sorted[0].crew_id
      }
    message.success(`Заказ создан успешно`)
    console.log("Данные", data)
    notification.open({
      message: 'Данные заказа',
      description: `${JSON.stringify(data)}`,
      duration: 20
    })
  }

  useEffect(() => {
    coords.length &&
      [...mockCar].map((car, index) =>
        ymaps.route([coords, [car.lat, car.lon]]).done((route: any) => {
          setCars((prev) => {
            prev[index] = {
              ...prev[index],
              distance: Math.ceil(route.getLength()),
            };
            return [...prev];
          });
        })
      );
  }, [coords, ymaps]);

  useEffect(() => {
    setSorted([...cars].sort((a, b) => a.distance - b.distance));
  }, [cars]);

  return (
    <div className={s.App}>
      <Layout className={s.wrapp}>
        <Content className={s.content}>
          <Title>Детали заказа</Title>
          <Divider className={s.divider} />
          <label className={s.label}>Откуда: </label>
          <Input
            className={s.input}
            placeholder="Введите адрес"
            value={values}
            onChange={onChange}
            id="suggest"
          />
          <ClosestCar coords={coords} cars={sorted} />
          <Row>
            <Col className={s.ymaps} xs={24} xl={17}>
              <YMaps query={{ apikey: "1de3764d-52b5-4301-887a-cef64aca7bc2" }}>
                <Map
                  width="100%"
                  height={400}
                  defaultState={{ center: [56.852676, 53.2069], zoom: 13 }}
                  state={{ center: coords.length === 0 ? [56.852676, 53.2069] : coords, zoom: 13}}
                  onClick={onMapClick}
                  modules={[
                    "geocode",
                    "SuggestView",
                    "route",
                    "control.SearchControl",
                  ]}
                  onLoad={(ymaps: any) => YmapsControl(ymaps)}
                >
                  <ZoomControl />
                  {coords.length ? (
                    <Placemark
                      options={{ iconColor: "#c7b300" }}
                      geometry={coords}
                    />
                  ) : null}
                  {coords.length
                    ? sorted.map((car) => (
                        <Placemark
                          options={{ iconColor: "#66cc9b" }}
                          properties={{
                            balloonContent: car.car_number,
                          }}
                          key={car.crew_id}
                          geometry={[car.lat, car.lon]}
                        />
                      ))
                    : null}
                </Map>
              </YMaps>
            </Col>
            <Col xs={24} xl={{ offset: 1, span: 6 }}>
              <CarsCard coords={coords} cars={sorted} />
            </Col>
          </Row>
          <Button className={s.button} onClick={handleClick} disabled={coords.length === 0}>Заказать</Button>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
