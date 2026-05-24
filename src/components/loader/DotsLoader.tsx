export default function DotsLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-2 py-1 ">
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-[#1a4b9b] rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-[#00296c] rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}