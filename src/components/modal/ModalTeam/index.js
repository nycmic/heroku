import React from "react"
import Modal from 'react-bootstrap/Modal'
import Image from "../../Image";

export default class ModalTeam extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(e) {
    e.preventDefault();
    this.setState({ show: true });
  }

  render() {
    const {item} = this.props;
    return (
      <>

        <div className="item">
          <a href="/" onClick={this.handleShow} className="team-link" target="_blank" rel="noopener noreferrer">
            <span className="img">
              <Image imgSrc={item.img}/>
            </span>
            <span className="title">
              <span className="title-inner">
                <span className="name">
                  {item.name}
                </span>
                 <span className="position">
                  {item.post}
                </span>
              </span>
            </span>
          </a>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose} className='b-modal b-modal_team'>
          <Modal.Header closeButton closeLabel=''>
            <div className="title">
              <div className="name">
                {item.name}
              </div>
              <div className="position">
                {item.post}
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>

            <div className="img">
              <Image imgSrc={item.img}/>
            </div>

            <div className="text">
              {item.desc}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}