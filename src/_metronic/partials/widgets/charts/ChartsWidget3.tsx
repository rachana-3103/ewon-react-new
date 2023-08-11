/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../assets/ts/_utils'
import {KTSVG} from '../../../helpers'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment';
type Props = {
  className: string
}

const ChartsWidget3: React.FC<Props> = ({className}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [dynamicValue, setDynamicValue] = useState('30 minutes')
  const [chartData, setChartData] = useState<any>()

  const [startDate, setStartDate] =  useState<any | null>(null);
  const [endDate, setEndDate] =  useState<any | null>(null);

  const handleStartDateChange = (date:any) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date:any) => {
    setEndDate(date);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(dynamicValue);
    }
  }, [startDate, endDate]);
  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    fetchData(dynamicValue)
  }, [dynamicValue])

  useEffect(() => {
    const height = parseInt(getCSS(chartRef.current!, 'height')) // Used non-null assertion here

    if (chartData) {
      const chart = new ApexCharts(chartRef.current!, getChartOptions(height)) // Used non-null assertion here
      chart.render()

      return () => {
        chart.destroy()
      }
    }
  }, [chartData])

  const fetchData = async (value: any) => {
    try {
      console.log(dynamicValue, '...........', value.split(' ')[0] ,value.split(' ')[1] )

      let response;
      if(value && !startDate && !endDate){
        console.log('......if')
        response = await fetch(
          `http://localhost:5000/api/syncdataGraph?${value.split(' ')[1]}=${value.split(' ')[0]}`
        )
      }else{
        console.log('......else ---')

        const startDateMoment = moment(startDate, "ddd MMM DD YYYY HH:mm:ss ZZ");
        const formattedStartDate = startDateMoment.format("YYYY-MM-DDTHH:mm:ssZ");
        const endDateMoment = moment(endDate, "ddd MMM DD YYYY HH:mm:ss ZZ");
        const formattedEndDate = endDateMoment.format("YYYY-MM-DDTHH:mm:ssZ");
        response = await fetch(
          `http://localhost:5000/api/syncdataGraph?startTime=${formattedStartDate.split('+')[0]+"Z"}&endTime=${formattedEndDate.split('+')[0]+"Z"}`
        )
      }
      
      response = await response.json()
      let data = JSON.parse(JSON.stringify(response))
      console.log("🚀 ~ data:", data)
      setChartData(data)
    } catch (error) {
      console.log(error)
    }
  }

  function getChartOptions(height: number) {
    const labelColor = getCSSVariableValue('--bs-black-500')
    const borderColor = getCSSVariableValue('--bs-red-200')
    const baseColor = getCSSVariableValue('--bs-info')
    const lightColor = getCSSVariableValue('--bs-light-info')
    let CM160FIT0003_VAL_PV_values = chartData.CM160FIT0003_VAL_PV.map((item: any) => item.value)
    console.log("🚀 ~ CM160FIT0003_VAL_PV_values:", CM160FIT0003_VAL_PV_values)
    let CM160PIT0023_VAL_PV_values = chartData.CM160PIT0023_VAL_PV.map((item: any) => item.value)
    console.log("🚀 ~ CM160PIT0023_VAL_PV_values:", CM160PIT0023_VAL_PV_values)
    let CM160LIT0008_VAL_PV_values = chartData.CM160LIT0008_VAL_PV.map((item: any) => item.value)
    console.log("🚀 ~ CM160LIT0008_VAL_PV_values:", CM160LIT0008_VAL_PV_values)
    
    let CM160FIT0003_VAL_PV_dates = chartData.CM160FIT0003_VAL_PV.map((item: any) => item.date)
    // console.log("🚀 ~ CM160FIT0003_VAL_PV_dates:", CM160FIT0003_VAL_PV_dates)
    // const intervalMinutes = 10;

//     const newArray = [];
//     let currentDate = new Date(startDate);
//     newArray.push(moment(startDate).format('YYYY-MM-DD HH:mm:ss'));
// while (currentDate <= endDate) {
//     currentDate.setMinutes(currentDate.getMinutes() + intervalMinutes);
//   newArray.push(moment(currentDate).format('YYYY-MM-DD HH:mm:ss'));
// }
//     console.log(newArray,'......new');
    
    return {
      series: [
        {
          name: 'CM160FIT0003_VAL_PV',
          data: CM160FIT0003_VAL_PV_values,
          color:'#529DA7',
          
        },
        {
          name: 'CM160PIT0023_VAL_PV',
          data: CM160PIT0023_VAL_PV_values,
          color:'#277871'
        },
        {
          name: 'CM160LIT0008_VAL_PV',
          data: CM160LIT0008_VAL_PV_values,
          color:'#B97660'
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'line',
        height: 500,
        weight: 700,
        toolbar: {
          show: false,
        },
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      // fill: {
      //   type: 'solid',
      // },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
      },
      xaxis: {
        type: 'datetime',
        categories: CM160FIT0003_VAL_PV_dates,
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
        crosshairs: {
          position: 'top',
          stroke: {
            color: 'red',
            width: 1,
            dashArray: 3,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: true,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        x: {
         format : 'dd/MM/yyyy HH:mm:ss'
        },
        y: {
          formatter: function (val: any) {
            return ' : ' + val
          },
        },
      },
      grid: {
        borderColor: lightColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        strokeColors: 'black',
        strokeWidth: 2,
      },
    }
  }

  return (
    <div className={`card ${className}`}  style={{height:'600px', width:'1300px'}}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5' >
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>EWON historical Data</span>
          {/* <span className='text-muted fw-bold fs-7'>More than 1000 new records</span> */}
        </h3>

          {/* begin::Menu */}
          <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        showTimeSelect
        timeFormat='HH:mm'
        startDate={startDate}
        endDate={endDate}
        dateFormat='yyyy/MM/dd h:mm aa'
        isClearable
        timeIntervals={1}
        placeholderText="Start Date"
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        showTimeSelect
        timeFormat='HH:mm'
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        dateFormat='yyyy/MM/dd h:mm aa'
        isClearable
        timeIntervals={1}
        placeholderText="End Date"
      />
        <div className='me-2'>
          <a
            href='#'
            className='btn btn-sm btn-flex btn-light btn-active-primary fw-bolder'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG
              path='/media/icons/duotune/general/gen031.svg'
              className='svg-icon-5 svg-icon-gray-500 me-1'
            />
            Filter
          </a>
          <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px' data-kt-menu='true'>
            <div className='px-7 py-5'>
              {/* <div className='fs-5 text-dark fw-bolder'>Filter Options</div> */}
              <div>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  defaultValue={'1'}
                  value={dynamicValue} // Set the value of the select to dynamicValue
                  onChange={(e) => setDynamicValue(e.target.value)} // Handle change event
                >
                  <option> Time Filter</option>
                  <option value='1 minutes'>1 Minute</option>
                  <option value='2 minutes'>2 Minutes</option>
                  <option value='3 minutes'>3 Minutes</option>
                  <option value='5 minutes'>5 Minutes</option>
                  <option value='10 minutes'>10 Minutes</option>
                  <option value='15 minutes'>15 Minutes</option>
                  <option value='30 minutes'>30 Minutes</option>
                  <option value='1 hour'>1 Hour</option>
                  <option value='2 hour'>2 Hours</option>
                  <option value='4 hour'>4 Hours</option>
                  <option value='6 hour'>6 Hours</option>
                  <option value='8 hour'>8 Hours</option>
                  <option value='12 hour'>12 Hours</option>
                  <option value='1 day'>1 Day</option>
                  <option value='2 day'>2 Days</option>
                  <option
                    value='3 day'
                    // onClick={() => setDynamicValue('3 day')}
                  >
                    3 Days
                  </option>
                  <option value='1 week'>1 Week</option>
                  <option value='2 week'>2 Weeks</option>
                  <option value='5 week'>5 Weeks</option>
                  <option value='13 week'>13 Weeks</option>
                </select>
              </div>
            </div>
          </div>
          </div>
          
      </div>
         
        {/* <div className='card-toolbar' data-kt-buttons='true'>
          <a
            className='btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1'
            id='kt_charts_widget_3_year_btn'
          >
            Year
          </a>

          <a
            className='btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1'
            id='kt_charts_widget_3_month_btn'
          >
            Month
          </a>

          <a
            className='btn btn-sm btn-color-muted btn-active btn-active-primary px-4'
            id='kt_charts_widget_3_week_btn'
          >
            Week
          </a>
        </div> */}

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_widget_3_chart' style={{height: '350px'}}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}
export {ChartsWidget3}
