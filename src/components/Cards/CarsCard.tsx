import { CarOutlined } from '@ant-design/icons'
import { Card, Col, Divider, Row } from 'antd'
import { Cars } from '../App'
import s from '../App.module.css'

type OwnProps = {
    coords: Array<number>
    cars: Cars
}

const CarsCard: React.FC<OwnProps> = ({coords, cars}) => {
    return (
        <Card title="Доступные машины" bordered={false}>
                {coords.length ? (
                  cars.map((c, index) => (
                    <Row key={c.crew_id} className={s.cars}>
                      <Col span={4}>
                        <CarOutlined className={s.icon} />
                      </Col>
                      <Col span={14}>
                        {c.car_mark} {c.car_model}
                      </Col>
                      <Col offset={1} span={5}>
                        {c.distance / 1000} км
                      </Col>
                      <Col offset={4} span={8}>
                        {c.car_color}
                      </Col>
                      <Col className={s.carnumber} offset={4} span={8}>
                        {c.car_number}
                      </Col>
                      {cars[index + 1] && <Divider />}
                    </Row>
                  ))
                ) : (
                  <p>
                    Введите адрес или выберете точку на карте, чтобы появились
                    доступные машины.
                  </p>
                )}
              </Card>
    )
}

export default CarsCard
