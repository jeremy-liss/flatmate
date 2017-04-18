import React from 'react'
import getFormData from 'get-form-data'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { fetchItems, postItem, postBill, postAllocation, fetchUsers, fetchFlatUsers, fetchBillAllocations, delBill } from '../actions'
import BillUsers from './BillUsers'
import BillItems from './BillItems'
import ProfileBar from './ProfileBar'

let table = 'bills'

const Bills = React.createClass ({
  componentDidMount () {
    this.props.dispatch(fetchItems('bills'))
    this.props.dispatch(fetchItems('billallocations'))
    this.props.dispatch(fetchFlatUsers())
    this.props.dispatch(fetchItems(table))
    this.props.dispatch(fetchUsers())
  },

  handleBillAdd(ev) {
    ev.preventDefault(ev)
    var newAllocation = (Math.round((ev.target.elements.amount.value / this.props.flatUsers.length + this.props.allocations[0].amount) * 100) / 100)
    this.props.dispatch(postAllocation(newAllocation))
    this.props.dispatch(postItem(getFormData(ev.target), table))
  },

  render () {

    let total = 0
    let userNum = 0

    this.props.billItems.map(function(bill){
      total += bill.amount
      return total
    })

    this.props.flatUsers.map(function(user){
      userNum ++
      return userNum
    })

    let userTotal= Math.round((total/ userNum) * 100) / 100

    return  (
      <div className='container'>
        <ProfileBar />
        <h2>Flat Bills</h2>
        <table className='bills'>
          <thead>
            <tr>
              <th>Bill</th>
              <th>Amount</th>
              {this.props.flatUsers.map(function(user, i){
                return <BillUsers name={user.name} key={i} id={user.id} />
              })}
              <th>Paid</th>
            </tr>
          </thead>
          <tbody>
            {this.props.billItems.map(function(bill, i){
              return <BillItems amount={bill.amount} details={bill.details} key={i} id={bill.id} userNum={userNum} table={table}/>
            })}
          </tbody>
        </table>
        <div className='totalBill'>
          <h5>Total: ${total} | You Owe: ${userTotal}</h5>
          <form onSubmit={(ev)=> this.handleBillAdd(ev)}>
            <input type="text" name="bill" placeholder="bill" />
            <input type="text" name="amount" placeholder="amount" />
            <button type="submit">Add</button>
          </form>
          <Link to='/home'>Return Home</Link>
        </div>
      </div>
    )
  }
})

const mapStateToProps = (state) => {
  return {
    billItems: state.returnItems.bills,
    users: state.returnUsers,
    allocations: state.returnAllocations,
    flatUsers: state.returnFlatUsers,
    dispatch: state.dispatch
  }
}

export default connect(mapStateToProps)(Bills)
