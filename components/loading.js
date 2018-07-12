import { RingLoader } from 'react-spinners';

export default props =>
  <div className={`modal ${props.show && 'is-active'}`}>
    <div className="modal-background"></div>
    <RingLoader loading={true} color="#FFFFFF" size="200"/>
  </div>
