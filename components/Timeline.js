import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
// import { useSpring, animated } from 'react-spring';
import * as vars from '../utils/jssVariables';
import businessHours from '../utils/businessHours';
import businessHoursMap from '../utils/businessHoursMap';

// import { timeMap } from '../utils/timeMap';

const styledBy = (property, mapping) => props => mapping[props[property]];

const useStyles = makeStyles({
  day: {
    margin: '2rem 0 0 2rem',
    display: 'inline',
    fontSize: '2rem',
    fontWeight: 200
  },
  numbers: {
    display: 'flex'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    borderRadius: '3px',
    boxShadow: vars.timelineBoxShadow,
    '&:not(last-child)': {
      marginRight: '1rem'
    }
  },
  hours: {
    fontSize: '2rem',
    fontWeight: 200,
    width: '20%',
    marginLeft: '1rem'
  },
  twoBoxes: {
    display: 'flex',
    alignItems: 'center',
    '&:not(last-child)': {
      borderBottom: '1px dotted grey'
    }
  },

  box: {
    flex: '1 1 auto',
    position: 'relative',
    height: '90px',
    borderRight: `1px solid ${vars.timelineBorderColor}`,
    cursor: 'pointer'
  },
  minutes: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1.8rem',
    fontWeight: '200',
    color: vars.timeColor
  },
  clear: {
    backgroundColor: vars.timelineClear
  },
  booked: {
    backgroundColor: vars.timelineBooked
  },
  availible: {
    backgroundColor: vars.timelineAvailible
  },
  yourAppointment: {
    backgroundColor: vars.timelineYourAppointment
  }
});

export default function Timeline({
  slots,
  day,
  isSunday,
  timelineType,
  data,
  onClear,
  onAlertUnavailible,
  onAvailible,
  onBooked,
  onClientLookup,
  ...props
}) {
  //*I don't know why this has to be destructured from this scope but it does.
  //* Passing props in as an argument to useStyles is mandatory
  const { color } = props;
  const classes = useStyles(props);
  //* */

  // const [toggle, setToggle] = useState(false);
  // const bg = useSpring();

  //* We need to make a 2d array so that we can easily switch our flex-container to column when we switch to mobile */
  function arrayReduce(arr, n) {
    return arr.reduce((a, e, i) => {
      if (i % n == 0) {
        a.push([e]);
      } else {
        a[a.length - 1].push(e);
      }
      return a;
    }, []);
  }

  const tuples = arrayReduce(slots, 2);

  const handleClick = (type, state, slot) => {
    switch (type) {
      case 'client':
        if (state === 'clear') {
          onBooked(slot);
        } else if (state === 'booked') {
          onAlertUnavailible();
        } else if (state === 'yourAppointment') {
          onClear(slot);
          console.log('Your Apointment has been Cancelled');
        } else {
          console.log('weewppzzz');
        }
        break;

      case 'instructor availibility':
        if (state === 'clear') {
          onAvailible(slot);
        } else if (state === 'availible') {
          onClear(slot);
        } else {
          console.log('ruh-roh');
        }
        break;

      case 'instructor schedule':
        if (state === 'booked') {
          onClientLookup(slot);
        } else if (state === 'clear') {
          onAvailible(slot);
        } else {
          console.log('Looks like Laurnado blew through here');
        }
        break;

      default:
        console.log('default');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={classes.day}>{day}</div>

      <div className={classes.timeline}>
        {tuples.map((tuple, index) => {
          return (
            <div className={classes.twoBoxes}>
              <div
                onClick={() => handleClick(timelineType, tuple[0], [day, index * 2])}
                className={`${classes.box} ${classes[tuple[0]]}`}
              >
                <span className={classes.minutes}>:00</span>
              </div>
              <div
                onClick={() => handleClick(timelineType, tuple[1], [day, index * 2 + 1])}
                className={`${classes.box} ${classes[tuple[1]]}`}
              >
                <span className={classes.minutes}>:30</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


//  query.forEach(datum => initialArray[businessHoursMap[datum.time]] = 'availible')