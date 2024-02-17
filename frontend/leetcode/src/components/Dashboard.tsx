function Dashboard() {
  return (
    <div className="container-fluide" style={{ backgroundColor: 'pink'}}>
      <div className="row">
        <div className="col-md-6" style={{ display: 'flex' ,margin: 0}}>
        <div  style={{ backgroundColor: 'green' }}>Leetcodeicon</div>
        <div  style={{ backgroundColor: 'red' }}>Explore</div>
        <div  style={{ backgroundColor: 'green' }}>Problems</div>
        <div  style={{ backgroundColor: 'green' }}>Contest</div>
        <div  style={{ backgroundColor: 'green' }}>Discuss</div>
        <div  style={{ backgroundColor: 'green' }}>Inteview</div>
        <div  style={{ backgroundColor: 'green' }}>Store</div>
        </div>
      <div className="col-md-6" style={{ backgroundColor: 'green',display:'flex',justifyContent: 'flex-end',margin: 0 }}>
      <div>Icon1</div>
        <div>Icon2</div>
        <div>Icon 3</div>
        <div>Icon 4</div>
        <div>Icon 5</div>

      </div>
        
      </div>
    </div>
  )
}

export default Dashboard
