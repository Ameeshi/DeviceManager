import React from 'react';
import './App.css';
import { bytesToString } from './formatting.js'
import devices from './devices.js'

function DeviceTable(props) {
  let deviceHeaders = []
  props.fields.forEach((header) => {
    deviceHeaders.push(
      <th key={header}>
        {props.fieldNames[header]}
      </th>
    )
  })

  let devices = props.devices
  if (props.sortedBy) {
    devices.sort((a, b) => {
      return b[props.sortedBy] - a[props.sortedBy]
    })
  }
  if (props.limit) {
    devices = devices.slice(0, props.limit)
  }
  const deviceRows = devices.map((device, id) => (
    <DeviceRow 
      key={device.ip}
      device={device}
      byteFields={props.byteFields}
      fields={props.fields}
      ownerName={props.ownerName}
      onChange={(field, value) => props.onChange(id, field, value)}
    />
  ))

  return (
    <table>
      <thead>
        <tr key={0}>
          {deviceHeaders}
        </tr>
      </thead>
      <tbody>
        {deviceRows}
      </tbody>
    </table>
  )
}



function DeviceRow(props) {
  let deviceItems = []
  props.fields.forEach((field) => {
    let toRender;
    if (props.ownerName && props.ownerName.some((editableProp) => editableProp === field)) {
      toRender = <input defaultValue={props.device[field]} onChange={(event) => props.onChange(field, event.target.value)} />
    }
    else if (props.byteFields.some((byteProp) => byteProp === field)) {
      toRender = bytesToString(props.device[field])
    }
    else {
      toRender = props.device[field]
    }
    deviceItems.push(
      <td key={field}>
        {toRender}
      </td>
    )
})

  return (
    <tr>
      {deviceItems}
    </tr>
  )
}


class App extends React.Component {
  
  constructor(props) {
    super(props)
    this.byteFields = ['memBytes', 'networkRxBytes', 'networkTxBytes']
    this.ownerName = ['owner']
    
    this.fieldNames = {
      ip: 'IP',
      owner: 'Owner',
      cpuPct: 'CPU %',
      memBytes: 'Memory',
      networkRxBytes: 'RX',
      networkTxBytes: 'TX'
    }

    this.state = {
      devices: devices,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(id, field, value) {
    let devices = this.state.devices
    devices[id][field] = value
    this.setState({
      devices: devices
    })
  }

  renderMainTable(ownerName) {
    let fields = ['ip', 'owner', 'cpuPct', 'memBytes', 'networkRxBytes', 'networkTxBytes']
    return (
      <div className="col-distribute">
        <h3>All Devices</h3>
        <DeviceTable
          fieldNames={this.fieldNames}
          devices={this.state.devices}
          byteFields={this.byteFields}
          fields={fields}
          ownerName={ownerName}
          onChange={this.handleChange}
          sortedBy='ip'
        />
      </div>
    )
  }

  renderTop5Common(sortedBy) {
    let title = "Top 5 " + this.fieldNames[sortedBy] + " Devices"
    let fields = ['ip', 'owner']
    fields.push(sortedBy)
    return (
      <div className="col-distribute">
        <h3>{title}</h3>
        <DeviceTable
          fieldNames={this.fieldNames}
          devices={this.state.devices}
          byteFields={this.byteFields}
          fields={fields}
          sortedBy={sortedBy}
          limit={5}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="App">
          <h2>Device Manager</h2>
        <div className="container">
          <div className="row">
            {this.renderTop5Common('cpuPct')}
            {this.renderTop5Common('memBytes')}
            {this.renderTop5Common('networkRxBytes')}
            {this.renderTop5Common('networkTxBytes')}
          </div>
          <div className="row">
            {this.renderMainTable(['owner'])}
          </div>
        </div>
      </div>
    )
  }
}

export default App