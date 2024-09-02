function CollegeForm() {
  return (
    <div>
  College Form
  <div className="relative">
    <input type="text" id="floating_input" className="block pt-3 pb-2 px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 border-gray-200" placeholder=" " />
    <label htmlFor="floating_input" className="absolute top-0 -z-1 duration-300 origin-0 text-gray-500">
      Outlined
    </label>
  </div>
</div>

  );
}

export default CollegeForm;
