/* eslint-disable */
import React from 'react';
import socket from '../../socket-client';

class Timer extends React.Component {
  constructor() {
    super()
    this.state = {
      questionTimer: 3,
      questionTimerFunc: {},
      waitTimer: 3,
      waitTimerFunc: {},
      isQuestionActive: true,
      isPaused: false,
      index: 0
    }
    this.onQuestionCountdown = this.onQuestionCountdown.bind(this)
    this.onWaitCountdown = this.onWaitCountdown.bind(this)
    this.onPause = this.onPause.bind(this)
    this.onResume = this.onResume.bind(this)
    this.onStartTimer = this.onStartTimer.bind(this)
  }

  componentDidMount() {
    const { questionTimerFunc, waitTimerFunc } = this.state
    const index = localStorage.getItem('index') * 1
    this.setState({ index })
    socket.on('game started', () => this.onStartTimer())
    socket.on('new game has started', () => this.setState({ index: 0 }))
    socket.on('game has ended', () => {
      clearTimeout(questionTimerFunc)
      clearTimeout(waitTimerFunc)
    })
  }

  onStartTimer() {
    this.onQuestionCountdown()
  }

  componentWillUnmount() {
    const { questionTimerFunc, waitTimerFunc } = this.state
    clearTimeout(questionTimerFunc)
    clearTimeout(waitTimerFunc)
  }

  onPause(timer) {
    const { waitTimerFunc, questionTimerFunc } = this.state
    if (timer === 'question') clearTimeout(questionTimerFunc)
    if (timer === 'wait') clearTimeout(waitTimerFunc)
    this.setState({ isPaused: true })
  }

  onResume(timer) {
    if (timer === 'question') this.onQuestionCountdown()
    if (timer === 'wait') this.onWaitCountdown()
    this.setState({ isPaused: false })
  }

  onQuestionCountdown() {
    const { bar } = this.props
    let { questionTimerFunc, questionTimer } = this.state
    if (localStorage.getItem('index') < 10) {
      if (questionTimer) {
        this.setState({
          questionTimer: questionTimer - 1,
          questionTimerFunc: setTimeout(() => this.onQuestionCountdown(), 1000)
        })
        socket.emit('question countdown', { bar, timer: this.state.questionTimer })
      }
      else {
          socket.emit('question over', bar)
          this.onWaitCountdown()
          this.setState({ questionTimer: 3, isQuestionActive: false })
      }
    }
  }

  onWaitCountdown() {
    const index = localStorage.getItem('index')
    const { bar } = this.props
    let { waitTimerFunc, waitTimer } = this.state
    if (waitTimer) {
      this.setState({
        waitTimer: waitTimer - 1,
        waitTimerFunc: setTimeout(() => this.onWaitCountdown(), 1000)
      })
      socket.emit('wait countdown', { bar, timer: this.state.waitTimer })
    }
    else {
      const index = localStorage.getItem('index')
      localStorage.setItem('index', (index * 1) + 1 )
      if (index < 10) {
        this.onQuestionCountdown()
        socket.emit('get next question', { bar, index })
      }
      this.setState({ waitTimer: 3, isQuestionActive: true })
    }
  }

  render() {
    const { questionTimer, waitTimer, isQuestionActive, isPaused } = this.state
    const { onPause, onResume } = this;
    const index = localStorage.getItem('index') * 1
    // console.log(index)
    if(index > 9) return null
      return (
        <div id='timer' className={ isQuestionActive ? questionTimer > 3 ? 'good' : questionTimer === 0 ? 'warning' : 'warning-animate' : 'wait' }>
          <div className='banner-question'>Question { index + 1 }</div>
            {
              isQuestionActive ?
              <div className='question-time'>00:{ questionTimer < 10 ? `0${questionTimer}` : questionTimer }</div>
            :
              <div className='wait-time'>{ index < 9 ? (`Next question in... ${ waitTimer < 10 ? `0${waitTimer}` : waitTimer }`) : ('Last question')}</div>
            }
          <div className='timer-buttons'>
            <button
              className='btn btn-dark mr-1'
              disabled={ isPaused }
              onClick={() => onPause( isQuestionActive ? 'question' : 'wait' )}>
              Pause
            </button>
            <button
              className='btn btn-dark'
              disabled={ !isPaused }
              onClick={() => onResume( isQuestionActive ? 'question' : 'wait' ) }>
              Resume
            </button>
          </div>
        </div>
      )
  }
}

export default Timer;
