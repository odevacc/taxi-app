import { CarOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { Cars } from '../App'
import s from '../App.module.css'

type OwnProps = {
    coords: Array<number>
    cars: Cars
}

const ClosestCar: React.FC<OwnProps> = ({coords, cars}) => {
    return (
        <>
            {coords.length ? (
            <Col xs={{offset:2, span: 22}} xl={{ offset: 10, span: 5 }} className={s.card}>
              <label>Подходящий авто</label>
              <hr />
              <Row className={s.cars}>
                <Col span={4}>
                  <CarOutlined className={s.icon} />
                </Col>
                <Col span={12}>
                  {cars[0].car_mark} {cars[0].car_model}
                </Col>
                <Col offset={1} span={7}>
                  {cars[0].distance / 1000} км
                </Col>
                <Col offset={4} span={8}>
                  {cars[0].car_color}
                </Col>
                <Col className={s.carnumber} offset={4} span={8}>
                  {cars[0].car_number}
                </Col>
              </Row>
            </Col>
          ) : null}
        </>
    )
}

export default ClosestCar
