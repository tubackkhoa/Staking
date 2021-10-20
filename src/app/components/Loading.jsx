import classNames from "classnames";

const Loading = ({ className = '' }) => {
  return(
    <div className={classNames("flex justify-center items-center", className)}>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    </div>
  )
}

export default Loading