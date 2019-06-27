import React, { Component } from "react";
import Slider from "react-slick";
import { htmlIn } from '../../helpers'

export default class SliderCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  render() {
    const {sliderItems} = this.props;

    return (
      <>

        <Slider
          className="bg-items b-slider"
          accessibility={true}
          dots={true}
          infinite={true}
          arrows={false}
          speed={500}
          autoplay={true}
          autoplaySpeed={10000}
          slidesToShow={1}
          slidesToScroll={1}
          swipe={false}
          asNavFor={this.state.nav2}
          ref={slider => (this.slider1 = slider)}
        >
          {sliderItems.map((item, i) => (
            <div className="item" key={i}>
              <div className="bg"
                   style={{backgroundImage: `url(${item.relationships.field_top_slider_fc_image.localFile.childImageSharp.fluid.src})`}}>
              </div>
            </div>
          ))}
        </Slider>

        <div className="desc-wrap">

          <div className="container">

              <Slider
                accessibility={true}
                dots={false}
                infinity={true}
                arrows={false}
                speed={500}
                fade={true}
                swipe={false}
                slidesToShow={1}
                slidesToScroll={1}
                asNavFor={this.state.nav1}
                ref={slider => (this.slider2 = slider)}
                className="desc"
              >
                {sliderItems.map((item, i) => (
                  < div className="item" key={i}>
                  <div className="text">
                    {htmlIn(item.field_top_slider_fc_text.value)}

                  </div>
                  <div className="btn-wrap">
                  <a className="btn style-a" href={item.field_top_slider_fc_link.options.alias_path}>
                    {item.field_top_slider_fc_link.title}
                  </a>
                  </div>
                  </div>
                ))}
              </Slider>

          </div>

        </div>

      </>
    );
  }
}