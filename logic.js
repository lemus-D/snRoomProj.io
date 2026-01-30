AFRAME.registerComponent('ghost-logic', {
  init: function() {
    // 1. GET REFERENCES
    this.target = document.querySelector('#my-target');
    this.content = document.querySelector('#my-content');
    this.statusDiv = document.querySelector('#debug-status');
    
    // 2. STATE TRACKING
    this.isTracking = false;
    this.lastKnownPos = null;
    this.lastKnownRot = null;

    // 3. EVENT: FOUND
    this.target.addEventListener("targetFound", () => {
      console.log("✅ Target Found!");
      this.isTracking = true;
      this.content.object3D.visible = true;

      // Debug UI Update
      if(this.statusDiv) {
        this.statusDiv.innerHTML = "STATUS: TRACKING ✓";
        this.statusDiv.style.background = "green";
      }
    });

    // 4. EVENT: LOST
    this.target.addEventListener("targetLost", () => {
      console.log("⚠️ Target Lost - Entering Ghost Mode");
      this.isTracking = false;

      // Capture the last known position/rotation when we lose tracking
      if (this.target.object3D.position && this.target.object3D.rotation) {
        this.lastKnownPos = this.target.object3D.position.clone();
        this.lastKnownRot = this.target.object3D.rotation.clone();
      }

      // Debug UI Update
      if(this.statusDiv) {
        this.statusDiv.innerHTML = "STATUS: GHOST MODE 👻";
        this.statusDiv.style.background = "orange";
      }
    });
  },

  tick: function() {
    // 5. THE TRACKING LOOP
    if (this.isTracking) {
      // ACTIVE TRACKING - Follow the target smoothly
      const targetPos = this.target.object3D.position;
      const targetRot = this.target.object3D.rotation;

      // Smooth position lerp (interpolation)
      this.content.object3D.position.lerp(targetPos, 0.3);

      // Direct rotation copy (you can lerp this too if you want smoother rotation)
      this.content.object3D.rotation.copy(targetRot);

    } else if (this.lastKnownPos && this.lastKnownRot) {
      // GHOST MODE - Hold the last known position
      // Content stays frozen in space where it was last seen
      this.content.object3D.position.copy(this.lastKnownPos);
      this.content.object3D.rotation.copy(this.lastKnownRot);
    }
  }
});