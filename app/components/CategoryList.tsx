import CategoryCard from './CategoryCard';

const CategoryList = async () => {
    try {
      const categoriesWithImages = await getCategoriesWithImages();
  
      return (
        <div className="flex-row flex flex-wrap gap-6 justify-center mb-20">
          {Object.keys(categoriesWithImages).map((category) => (
            <CategoryCard
              key={category}
              category={category}
              categoryImage={categoriesWithImages[category]}
            />
          ))}
        </div>
      );
    } catch (error) {
      console.error('Error fetching categories with images:', error);
      return <div>Error fetching data</div>;
    }
  };
  
  async function getCategoriesWithImages() {
    try {
      const res = await fetch('https://the-trivia-api.com/v2/categories');
      const categoriesData = await res.json();
      const mainCategories = Object.keys(categoriesData);
  
      const pexelsApiKey = process.env.PEXELS_API_KEY;
  
      const imagePromises = mainCategories.map(async (category) => {
        const pexelsUrl = `https://api.pexels.com/v1/search?query=${category}&per_page=1`;
    
        const imageResponse = await fetch(pexelsUrl, {
          headers: {
            Authorization: `${pexelsApiKey}`,
          },
        });

        const imageData = await imageResponse.json();
        if (imageData.photos.length > 0) {
          const imageUrl = imageData.photos[0].src.original;
          return { [category]: imageUrl };
        }
    
        return { [category]: 'https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'};
      });
  
      const imagesArray = await Promise.all(imagePromises);
  
      const categoriesWithImages = Object.assign({}, ...imagesArray);
  
      return categoriesWithImages;
    } catch (error) {
      throw new Error('Error fetching categories with images');
    }
  }

  export default CategoryList;
