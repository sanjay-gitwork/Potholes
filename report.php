<?php include "includes/header.php"; ?>

<?php include "includes/navigation.php"; ?>

  <!-- Main Section -->
  <main class="max-w-6xl mx-auto px-4 py-8">
    <section class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-6">Report a Pothole</h2>

      <form id="reportForm" class="space-y-4">
        <!-- <div>
          <label class="block mb-1 font-medium">Full Name</label>
          <input type="text" name="name" required class="w-full border rounded-md p-2">
        </div> -->

    <!--     <div>
          <label class="block mb-1 font-medium">Email</label>
          <input type="email" name="email" required class="w-full border rounded-md p-2">
        </div> -->

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block mb-1 font-medium">City</label>
            <select id="citySelect" name="city" required class="w-full border rounded-md p-2">
              <option value="">Select City</option>
              <option>Ranchi</option>
              <option>Patna</option>
              <option>Kolkata</option>
              <option>Delhi</option>
              <option>Mumbai</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block mb-1 font-medium">Severity</label>
            <select name="severity" required class="w-full border rounded-md p-2">
              <option value="">Select Severity</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block mb-1 font-medium">Description</label>
          <textarea name="description" rows="4" required class="w-full border rounded-md p-2"></textarea>
        </div>

        <div>
          <label class="block mb-1 font-medium">Upload Image</label>
          <input type="file" id="photo" accept="image/*" class="w-full border rounded-md p-2">
          <img id="preview" class="mt-2 hidden w-32 h-32 object-cover rounded-md border" />
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block mb-1 font-medium">Latitude</label>
            <input type="text" id="latitude" name="latitude" class="w-full border rounded-md p-2" readonly>
          </div>
          <div class="flex-1">
            <label class="block mb-1 font-medium">Longitude</label>
            <input type="text" id="longitude" name="longitude" class="w-full border rounded-md p-2" readonly>
          </div>
        </div>

        <div>
          <label class="block mb-1 font-medium">Select Location on Map</label>
          <div id="mapmark" class="h-64 rounded-md border"></div>
        </div>

        <div class="flex gap-4">
          <button type="button" id="geoBtn" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
            Use My Location
          </button>
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Submit Report
          </button>
        </div>
      </form>
    </section>
  </main>
    <!-- Toast Notification -->
  <div id="toast" class="toast fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
    Report submitted successfully!
  </div>

  <?php include "includes/footer.php"; ?>
