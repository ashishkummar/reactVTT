import React, { useEffect, useRef, useState } from 'react';
import './pixels.css';
import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,
  ModalTitle,
} from 'react-bootstrap';
import '../../Panel/bootstrap.min.css';

export default function CompareETPixels(prop) {
  const inputRef = useRef();
  const compareDivRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  var _etPxls = '';
  function compareListener(e) {
    if (
      inputRef.current.value.length == 0 ||
      Number(inputRef.current.value) <= 60000
    ) {
      return;
    }

    showModal();
    loadPixlFromET(inputRef.current.value);
  }

  function loadPixlFromET(_etID) {
    //
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      // console.info('API says ', this.response);

      if (this.response == '') {
        return;
      }

      var objPixel = JSON.parse(this.response);

      _etPxls = '';

      //~
      for (var i = 0; i < objPixel.length; i++) {
        console.info(objPixel[i].event_name, ' | ', objPixel[i].description);

        _etPxls +=
          "<span title='Available on ExpoTask but missing in designer-config'  class='text-liteColor'>" +
          objPixel[i].description +
          '</span>';
      }

      //console.log('::_etPxls = ', _etPxls);

      if (_etPxls === '') {
        _etPxls = 'No records available';
      }

      compareDivRef.current.innerHTML = _etPxls;

      compareExpoTastpixels(compareDivRef.current);

      //console.log('--> ', $('#ctaGrid').get(0).getBoundingClientRect().y);
      //.animate( properties [, duration] [, easing] [, complete] );
      // movine pixel box popup to bottom
      //$('#compWithET').css("display","block");

      /*
        $('#compWithET').animate({scrollTop:$('#compWithET').get(0).getBoundingClientRect().y-100}, {
			duration:300, specialEasing: {
			width: "linear",
			height: "easeOutBounce"
		}, complete: function() {
			compareExpoTastpixels($('#etPixs')); // on complete of animation.
		}});
			*/
      //}
    }; // end of of on ready state change

    xhttp.onerror = function () {
      console.log('** An error occurred during the transaction');
    };

    xhttp.ontimeout = function () {
      console.log('ontimeout:.. ', xhttp.status);
    };
    xhttp.onprogress = function () {
      console.log('LOADING:.. ', xhttp.status);
    };

    //$('#model1close').on('click', function () {
    // $('button#compareETpix').prop('disabled', false);
    // spinner.addClass('d-none');
    //});
    //
    xhttp.open(
      'GET',
      'https://expotask.exponential.com/node/creative-request/tracking-pixels/apilist/' +
        _etID,
      true
    );
    xhttp.send();
  }

  //

  useEffect(() => {}, []);

  function compareExpoTastpixels(_etPixs) {
    console.log('compareExpoTastpixels called');
    //// intlive compare check --------------
    // cross examining
    for (let i = 0; i < prop.intLives.length; i++) {
      for (let j = 0; j < _etPixs.childNodes.length; j++) {
        if (
          prop.intLives[i].ints.localeCompare(
            _etPixs.childNodes[j].textContent.trim()
          ) === 0
        ) {
          _etPixs.childNodes[j].removeAttribute('title');
          _etPixs.childNodes[j].classList.remove('text-liteColor');
          _etPixs.childNodes[j].classList.add('text-intETcompared');
        }
      }
    }

    //// clickLive compare check
    for (let a = 0; a < prop.clickLives.length; a++) {
      for (let b = 0; b < _etPixs.childNodes.length; b++) {
        if (
          prop.clickLives[a].clicks.localeCompare(
            _etPixs.childNodes[b].textContent.trim()
          ) === 0
        ) {
          _etPixs.childNodes[b].removeAttribute('title');
          _etPixs.childNodes[b].classList.remove('text-liteColor');
          _etPixs.childNodes[b].classList.add('text-ctaETcompared');
        } else {
          console.log(
            'non matched cta is -> ',
            _etPixs.childNodes[b].textContent.trim()
          );
        }
      }
    }

    //  removing preloder
    // setTimeout(_ => spinner.addClass('d-none'), 0);

    // Add check marks ✓ to main pixels list.

    //
  }

  ////

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title className="modal-title h6">
            Compare Pixels with Expotask
          </Modal.Title>
          <button
            onClick={hideModal}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ 'font-size': '17px', color: 'blue' }}>
                {' '}
                &#9632;{' '}
              </span>
              ClickLive
              <span style={{ 'font-size': '17px', color: 'green' }}>
                {' '}
                &#9632;{' '}
              </span>
              IntLive
              <span
                style={{
                  'font-size': '17px',
                  color: 'red',
                }}
              >
                {' '}
                &#9632;{' '}
              </span>{' '}
              Unmatched
              <br />
              <br />
            </div>
          </div>
          <div
            ref={compareDivRef}
            style={{
              width: '100%',
              height: '410px',
              overflow: 'scroll',
              fontSize: '13px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          ></div>
        </Modal.Body>
      </Modal>
      {
        <div className="input-group input-group-sm mb-3">
          <input
            ref={inputRef}
            inputMode="numeric"
            pattern="[0-9]*"
            size="6"
            maxLength="6"
            className="form-control"
            id="ETpixTXT"
            placeholder="Enter ET ID"
            aria-label="Enter ExpoTask ID"
            aria-describedby="basic-addon2"
          />

          <div className="input-group-append">
            <Button
              className="btn btn-secondary"
              onClick={compareListener}
              id="compareETpix"
              type="button"
            >
              <span
                className="d-none spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Compare Pixels with ExpoTask{' '}
            </Button>
          </div>
        </div>
      }
    </>
  );
}
