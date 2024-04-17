import React from 'react';

const ProfileView: React.FC = () => {
  // Dummy data for profile and products
  const profileData = {
    imageUrl: 'path/to/profile-image.jpg',
    name: 'John Doe',
    description: 'A detailed description about the user...',
    // Other data fields...
  };

  const productsData = [
    {
      thumbnailUrl: 'path/to/thumbnail.jpg',
      title: 'Product Title',
      description: 'Short description of the product...',
      // Other data fields...
    },
    // More products...
  ];

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="flex flex-wrap md:flex-nowrap">
        {/* Profile Section */}
        <div className="w-full md:w-1/3">
          <img
            src={profileData.imageUrl}
            alt="Profile"
            className="rounded-full w-32 h-32 mx-auto"
          />
          <h2 className="text-xl font-bold text-center mt-4">
            {profileData.name}
          </h2>
          <p className="text-gray-600 text-sm text-center mt-2">
            {profileData.description}
          </p>
        </div>

        {/* Product List */}
        <div className="w-full md:w-2/3 md:pl-8">
          {productsData.map((product, index) => (
            <div key={index} className="border-b py-4">
              <img
                src={product.thumbnailUrl}
                alt="Thumbnail"
                className="w-16 h-16 float-left mr-4"
              />
              <h3 className="font-bold">{product.title}</h3>
              <p className="truncate">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;