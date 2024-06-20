export default function PageLayout({ middle, right }) {
  return (
    <div className="row">
      <div className="col-sm-3">

      </div>
      <div className="col-sm-6">
        {middle}
      </div>
      <div className="col-sm-3">
        {right}
      </div>
    </div>
  )
}