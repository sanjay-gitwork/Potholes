<?php include "includes/header.php"; ?>
  <?php include "includes/navigation.php"; ?>

  <main class="relative max-w-6xl mx-auto px-4 py-6">
    <!-- topbar (floating) -->
    <div class="map-topbar">
      <div class="card bg-white bg-opacity-90 rounded-lg shadow-md p-3 flex flex-wrap gap-3 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">City</label>
          <select id="filterCity" class="border rounded-md p-1">
            <option value="">All</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Severity</label>
          <select id="filterSeverity" class="border rounded-md p-1">
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Status</label>
          <select id="filterStatus" class="border rounded-md p-1">
            <option value="">All</option>
            <option value="reported">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        <div class="flex-1 min-w-[220px]">
          <input id="searchInput" placeholder="Search address or coordinates" class="w-full border rounded-md p-2" />
        </div>

        <div class="flex items-center gap-2">
          <button id="searchBtn" class="bg-blue-600 text-white py-1 px-3 rounded-md">Search</button>
          <button id="resetBtn" class="bg-gray-200 py-1 px-3 rounded-md">Reset</button>
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <label class="text-sm">Heatmap</label>
          <input type="checkbox" id="toggleHeat" />
          <label class="text-sm ml-3">Cluster</label>
          <input type="checkbox" id="toggleCluster" checked />
        </div>
      </div>
    </div>

    <!-- map container -->
    <section class="bg-white rounded-lg shadow-md p-0 mt-16">
      <div id="map"></div>
    </section>
  </main>

  <?php include "includes/footer.php"; ?>


