# Orbit Browser — Final Development Roadmap

**Status:** In Development  
**Current Version:** 105.0.5195.33 (based on Chromium 105)  
**Target Version:** Chromium 130+ (Orbit v1.0)  
**Repository:** `kittenspubg-svg/src.next`

---

## Executive Summary

Orbit Browser is a modern fork of Kiwi Browser built on Chromium, featuring:
- **Crystal Sharp Premium Dark Theme** with multiple color variants
- **Custom New Tab Page** with search, shortcuts, and theme switcher
- **Developer Menu** for NTP settings and debugging
- **Modern Android Build Pipeline** via GitHub Actions
- **Full Chromium Upgrade** to latest stable baseline

This roadmap outlines the path from current state (Chromium 105) to production release (Orbit v1.0).

---

## Phase 1: Foundation & Setup (Week 1-2)

### Milestone 1.1: Repository Upgrade Branch
**Status:** ✅ DONE  
**Deliverables:**
- [x] Create branch `upgrade/chromium-130`
- [x] Document upgrade strategy
- [x] Backup custom NTP patch

**Next:** Sync upstream Chromium

### Milestone 1.2: Chromium Sync & Upstream Integration
**Status:** 🔄 IN PROGRESS  
**Timeline:** Week 1-2  
**Tasks:**
- [ ] Add upstream Chromium remote
- [ ] Fetch target version (Chromium 130+)
- [ ] Resolve merge conflicts
- [ ] Validate `.gn` and `DEPS` files
- [ ] Test `gclient sync` completion

**Commands:**
```bash
git checkout upgrade/chromium-130
git remote add upstream https://chromium.googlesource.com/chromium/src.git
git fetch upstream
git checkout -b chromium-130 upstream/130
gclient sync
```

**Success Criteria:**
- `.gn` file exists
- `DEPS` file intact
- `build/` directory complete
- `gclient sync` finishes without errors

### Milestone 1.3: Environment Setup
**Status:** 📋 PLANNED  
**Timeline:** Week 2  
**Tasks:**
- [ ] Install depot_tools
- [ ] Setup Android SDK/NDK
- [ ] Install build dependencies
- [ ] Configure GN/Ninja
- [ ] Validate Java 17

**Environment Variables:**
```bash
export PATH="$HOME/depot_tools:$PATH"
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
export JAVA_HOME=/usr/lib/jvm/temurin-17-jdk-amd64
```

---

## Phase 2: Custom Patch Integration (Week 2-3)

### Milestone 2.1: Reapply Orbit Custom NTP
**Status:** 📋 PLANNED  
**Timeline:** Week 2-3  
**Tasks:**
- [ ] Copy custom NTP files to Chromium source
- [ ] Validate file paths and resource registration
- [ ] Check CSS/JS syntax
- [ ] Verify theme system integration
- [ ] Test developer menu integration

**Files to Apply:**
```
chrome/browser/resources/new_tab_page/index.html
chrome/browser/resources/new_tab_page/style.css
chrome/browser/resources/new_tab_page/script.js
```

**Features to Preserve:**
- [x] Search input functionality
- [x] Quick shortcuts/tiles (8 items)
- [x] Local time display
- [x] Weather card
- [x] Theme switcher (5 themes)
- [x] Developer menu (⚙️)
- [x] LocalStorage persistence
- [x] Smooth transitions

**Success Criteria:**
- Custom NTP files in correct location
- No syntax errors in CSS/JS
- Resource registration validated
- All themes selectable

### Milestone 2.2: Build System Validation
**Status:** 📋 PLANNED  
**Timeline:** Week 3  
**Tasks:**
- [ ] Generate GN build config
- [ ] Validate `chrome_public_apk` target
- [ ] Compile minimal test build
- [ ] Fix any build errors
- [ ] Ensure custom NTP is included

**Build Command:**
```bash
gn gen out/Orbit --args='
target_os="android"
target_cpu="arm64"
is_debug=false
is_component_build=false
use_official_google_api_keys=false
enable_nacl=false
'
```

**Build Target:**
```bash
autoninja -C out/Orbit chrome_public_apk
```

**Success Criteria:**
- `gn gen` completes without errors
- Target `chrome_public_apk` exists
- Build runs without failure
- APK artifact generated

---

## Phase 3: Build & Testing (Week 3-4)

### Milestone 3.1: Android APK Build
**Status:** 📋 PLANNED  
**Timeline:** Week 3-4  
**Tasks:**
- [ ] Build release APK (`chrome_public_apk`)
- [ ] Verify artifact generation
- [ ] Sign APK (if needed)
- [ ] Test on Android device
- [ ] Validate NTP loads correctly

**Build Output:**
```
out/Orbit/apks/ChromePublic.apk
```

**Success Criteria:**
- APK builds successfully
- Artifact size reasonable (< 200MB typical)
- No build warnings/errors
- APK installable on Android 10+

### Milestone 3.2: UI/UX Validation
**Status:** 📋 PLANNED  
**Timeline:** Week 4  
**Tasks:**
- [ ] Test custom NTP displays
- [ ] Verify search functionality
- [ ] Test all 5 theme variants
- [ ] Validate theme persistence
- [ ] Test developer menu
- [ ] Check clock/weather updates
- [ ] Verify no runtime JS errors

**Test Checklist:**
- [ ] NTP loads on app start
- [ ] Search input accepts text
- [ ] Shortcuts render and link correctly
- [ ] Theme switcher changes colors
- [ ] Developer menu opens/closes
- [ ] Settings persist after restart
- [ ] No console errors
- [ ] Animations smooth
- [ ] Mobile responsive

**Success Criteria:**
- All UI elements render correctly
- Search/shortcuts functional
- No JavaScript errors
- Smooth theme transitions
- Settings persist across sessions

### Milestone 3.3: Performance & Stability
**Status:** 📋 PLANNED  
**Timeline:** Week 4  
**Tasks:**
- [ ] Test app startup time
- [ ] Monitor memory usage
- [ ] Check CPU utilization
- [ ] Verify battery impact
- [ ] Test on various Android versions
- [ ] Check for crashes/ANRs

**Success Criteria:**
- App starts in < 3 seconds
- Memory usage stable (< 200MB typical)
- No crashes after 1 hour usage
- Compatible with Android 10+

---

## Phase 4: GitHub Actions Build Pipeline (Week 4-5)

### Milestone 4.1: Workflow Setup
**Status:** 📋 PLANNED  
**Timeline:** Week 4-5  
**Tasks:**
- [ ] Create `.github/workflows/orbit-build.yml`
- [ ] Configure self-hosted runner (recommended)
- [ ] Setup artifact upload
- [ ] Configure release triggers
- [ ] Add build status badge

**Workflow Triggers:**
- Manual (`workflow_dispatch`)
- Push to `upgrade/chromium-130`
- Push to `feature/terminal-theme-ntp`
- Tag push (`v*`)

**Build Steps:**
1. Checkout source
2. Setup Java 17
3. Install dependencies
4. Install depot_tools
5. Setup Android SDK
6. Generate GN config
7. Build APK target
8. Upload artifact

**Success Criteria:**
- Workflow runs successfully
- APK artifact generated
- Build takes < 1 hour on self-hosted runner
- Artifact downloadable from Actions

### Milestone 4.2: Artifact Management
**Status:** 📋 PLANNED  
**Timeline:** Week 5  
**Tasks:**
- [ ] Setup artifact naming convention
- [ ] Configure artifact retention
- [ ] Create release notes template
- [ ] Setup GitHub Releases integration
- [ ] Document download instructions

**Artifact Naming:**
```
OrbitBrowser-arm64-v8a-v1.0.0.apk
OrbitBrowser-debug-v1.0.0.apk
orbit-android-artifacts-v1.0.0.zip
```

**Success Criteria:**
- Artifacts named consistently
- Releases tagged properly
- Release notes automated
- Download links accessible

---

## Phase 5: Branding & Polish (Week 5-6)

### Milestone 5.1: Orbit Branding
**Status:** 📋 PLANNED  
**Timeline:** Week 5-6  
**Tasks:**
- [ ] Update app title to "Orbit"
- [ ] Apply Orbit logo/icon
- [ ] Update app strings and labels
- [ ] Custom splash screen
- [ ] Package name consideration (keep compatible if possible)
- [ ] About screen / version info

**Branding Elements:**
- App name: "Orbit Browser"
- Version: 1.0.0
- Build identifier: Chromium 130 base
- Tagline: "Sharp, Neon, Premium Dark Browsing"

**Success Criteria:**
- App displays "Orbit Browser" everywhere
- Custom icon visible on device
- Splash screen shows Orbit branding
- About screen has version info

### Milestone 5.2: Documentation
**Status:** 📋 PLANNED  
**Timeline:** Week 5-6  
**Tasks:**
- [ ] Create README.md for Orbit
- [ ] Document build instructions
- [ ] Create user guide
- [ ] Setup troubleshooting guide
- [ ] Document developer menu features
- [ ] Create changelog

**Documentation Structure:**
```
README.md              - Overview
BUILD.md              - Build instructions
FEATURES.md           - Feature list
DEVELOPER_GUIDE.md    - Dev menu + API docs
CHANGELOG.md          - Version history
TROUBLESHOOTING.md    - Common issues
```

**Success Criteria:**
- All docs complete
- Build steps verified
- User guide clear
- Troubleshooting covers common issues

### Milestone 5.3: Release Preparation
**Status:** 📋 PLANNED  
**Timeline:** Week 6  
**Tasks:**
- [ ] Create release notes v1.0.0
- [ ] Prepare changelog
- [ ] Test release build
- [ ] Verify APK integrity
- [ ] Create GitHub Release
- [ ] Tag version (v1.0.0)

**Release Content:**
- APK artifact
- Release notes (features, fixes, known issues)
- Installation instructions
- System requirements
- Known limitations

**Success Criteria:**
- Release published on GitHub
- APK downloadable
- Release notes comprehensive
- Version tagged correctly

---

## Phase 6: Post-Release & Maintenance (Week 6+)

### Milestone 6.1: User Testing & Feedback
**Status:** 📋 PLANNED  
**Timeline:** Week 6+  
**Tasks:**
- [ ] Gather user feedback
- [ ] Monitor issue reports
- [ ] Track app crashes
- [ ] Collect feature requests
- [ ] Performance monitoring

### Milestone 6.2: Maintenance & Updates
**Status:** 📋 PLANNED  
**Timeline:** Ongoing  
**Tasks:**
- [ ] Security updates from Chromium
- [ ] Bug fixes
- [ ] Performance optimizations
- [ ] New feature development
- [ ] Regular releases (monthly/quarterly)

---

## Technical Specifications

### Build Requirements

**Hardware (Recommended):**
- CPU: 8+ cores
- RAM: 32 GB
- Storage: 200 GB free
- Internet: 100 Mbps+

**Software:**
- OS: Linux 64-bit (Ubuntu 20.04+ recommended)
- Java: OpenJDK 17 / Temurin 17
- Python: 3.8+
- Git: Latest
- Android SDK: API 30+
- NDK: Latest stable

### Build Targets
- Primary: `chrome_public_apk` (Android ARM64)
- Optional: `chrome_modern_public_apk` (if available)
- Test: `android_apk` (minimal test build)

### Target Platform
- **OS:** Android 10+ (API 29+)
- **Arch:** ARM64 (primary), ARMv7 (optional)
- **Min Screen:** 5" phones, 7" tablets
- **RAM:** 2GB minimum, 4GB recommended

---

## Risk & Mitigation

### Risk 1: Upstream Version Incompatibility
**Impact:** High  
**Mitigation:** 
- Test minimal build first
- Run comprehensive UI/UX testing
- Validate resource registration
- Keep branch separate from main

### Risk 2: Custom Patch Conflicts
**Impact:** Medium  
**Mitigation:**
- Document all custom changes
- Backup original files
- Test patch application step-by-step
- Validate CSS/JS syntax

### Risk 3: Build Time & Resource Constraints
**Impact:** Medium  
**Mitigation:**
- Use self-hosted runner for CI/CD
- Cache build artifacts where possible
- Optimize build configuration
- Use incremental builds during development

### Risk 4: Android Compatibility Issues
**Impact:** Low-Medium  
**Mitigation:**
- Test on multiple Android versions
- Monitor API deprecations
- Update SDK/NDK regularly
- Check Chromium release notes

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Build completion time | < 1 hour (self-hosted) | 📋 |
| APK size | < 200 MB | 📋 |
| App startup time | < 3 sec | 📋 |
| Memory usage | < 200 MB typical | 📋 |
| NTP load time | < 1 sec | 📋 |
| Theme switch response | < 100 ms | 📋 |
| Crash rate | 0% | 📋 |
| Test coverage | > 80% | 📋 |

---

## Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Foundation & Setup | 2 weeks | 🔄 In Progress |
| Phase 2: Custom Patch Integration | 2 weeks | 📋 Planned |
| Phase 3: Build & Testing | 2 weeks | 📋 Planned |
| Phase 4: GitHub Actions Pipeline | 2 weeks | 📋 Planned |
| Phase 5: Branding & Polish | 2 weeks | 📋 Planned |
| Phase 6: Post-Release | Ongoing | 📋 Planned |
| **Total** | **~6-8 weeks** | |

**Estimated Release Date:** 6-8 weeks from Phase 1 start

---

## Next Steps

1. **Immediate (This Week):**
   - [ ] Setup development environment (depot_tools, Android SDK)
   - [ ] Verify Chromium checkout completeness
   - [ ] Begin upstream sync

2. **Short Term (Week 1-2):**
   - [ ] Complete Chromium sync
   - [ ] Resolve merge conflicts
   - [ ] Reapply custom NTP patch
   - [ ] Validate build system

3. **Medium Term (Week 2-4):**
   - [ ] Build and test APK
   - [ ] UI/UX validation
   - [ ] Performance testing
   - [ ] Setup GitHub Actions

4. **Long Term (Week 4-6):**
   - [ ] Apply Orbit branding
   - [ ] Complete documentation
   - [ ] Prepare v1.0.0 release
   - [ ] Public release

---

## Contact & Support

**Repository:** [kittenspubg-svg/src.next](https://github.com/kittenspubg-svg/src.next)  
**Branch:** `upgrade/chromium-130`  
**Issues:** GitHub Issues  
**Discussions:** GitHub Discussions

---

## Version History

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 1.0.0-alpha | TBD | Planning | Initial release based on Chromium 130 |
| 0.1.0 | Current | Active | Orbit theme & NTP development |

---

**Last Updated:** 2026-09-27  
**Next Review:** After Phase 1 completion

