import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import './styles.css';

export class ProfileAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
    this.onDrop = this.onDrop.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.image !== prevState.image) {
      return {
        image: nextProps.image,
      };
    }

    return null;
  }

  onDrop(files) {
    if (files.length) {
      this.props.changeAvatar(files[0]);
    }
  }

  render() {
    const { image } = this.state;
    return (
      <div className="dropzone">
        <div className="dropzone_content">
          <Dropzone
            accept="image/jpeg, image/png"
            maxSize={2097152}
            multiple={false}
            onDrop={this.onDrop}
            className="field"
          >
            {image && (
              <img src={image} alt="user avatar" className="profile-info_img" />
            )}
          </Dropzone>
          <p className="upload-help">
            Кликни на картинку, чтобы обновить аватар
          </p>
        </div>
      </div>
    );
  }
}
