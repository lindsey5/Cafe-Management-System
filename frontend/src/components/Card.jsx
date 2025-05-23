
const Card = ({ label, value }) => {

    return <div className="p-8 border-gray-300 p-5 bg-white shadow-md rounded-md">
        <p className="text-gray-500">{label}</p>
        <h1 className="font-bold text-3xl mt-2">{value}</h1>
    </div>
}

export default Card