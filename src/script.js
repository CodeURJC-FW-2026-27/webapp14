
// car filter
export function filterCars(cars, query) {
  const searchText = query.search ? query.search.trim().toLowerCase() : "";
  const fCountry = query["filter-country"];
  const fRating = query["filter-rating"];
  const fSegment = query["filter-segment"];

  let results = [];

  if (searchText !== "") {
    results = cars.filter(car => car.name && car.name.toLowerCase().includes(searchText));
  } else {
    results = cars.filter(car => {
      const matchCountry = !fCountry || fCountry === "COUNTRY" || 
          (car.country && car.country.toLowerCase().trim() === fCountry.toLowerCase().trim());

      const matchRating = !fRating || fRating === "RATING" || 
          (car.rating && String(car.rating).trim() === String(fRating).trim());

      const matchSegment = !fSegment || fSegment === "SEGMENT" || 
          (car.segment && car.segment.toLowerCase().trim() === fSegment.toLowerCase().trim());

      return matchCountry && matchRating && matchSegment;
    });
  }

  return results;
}

// Lógica para paginar cualquier array de resultados
export function generatePagination(cars, currentPage) {
  const page = parseInt(currentPage) || 1;
  const limit = 6;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedResults = cars.slice(startIndex, endIndex);
  const totalPages = Math.ceil(cars.length / limit);
  
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({
      number: i,
      isCurrent: i === page
    });
  }

  return {
    paginatedResults,
    pages,
    totalPages,
    hasMultiplePages: totalPages > 1
  };
}