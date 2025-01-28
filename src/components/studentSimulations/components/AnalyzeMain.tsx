"use client"

import React, { useEffect, useRef, useState } from "react"
import { useSimulationModel } from "../../models/SimulationPage"
import MetricsTab from "./MetricsTab"
import DashboardTab from "./DashboardTab"
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md"

export default function AnalyseMain() {
  const [salesTimeRange, setSalesTimeRange] = useState<string>("7 days")
  const [comparisonTimeRange, setComparisonTimeRange] = useState<string>("7 days")
  const {
    SimulationAnalysisTabs,
    activeTab,
    handleSelectTab,
  } = useSimulationModel()

  const salesData = [
    { day: "Mon", value: 150 },
    { day: "Tues", value: 100 },
    { day: "Wed", value: 75 },
    { day: "Thurs", value: 148 },
    { day: "Fri", value: 120 },
    { day: "Sat", value: 90 },
    { day: "Sunday", value: 180 },
  ]

  const comparisonData = [
    { day: "Mon", current: 270, previous: 190 },
    { day: "Tues", current: 90, previous: 140 },
    { day: "Wed", current: 30, previous: 60 },
    { day: "Thurs", current: 110, previous: 140 },
    { day: "Fri", current: 190, previous: 180 },
    { day: "Sat", current: 240, previous: 190 },
  ]

  const metricsData = Array(10).fill(null).map((_, index) => ({
    metric: `Metric ${index + 1}`,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100),
  }))
  
  const sliderRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showRightButton, setShowRightButton] = useState(true)
  const itemsPerView = 5

  const updateButtonVisibility = () => {
    const slider = sliderRef.current
    if (slider) {
      const scrollPosition = slider.scrollLeft
      const tabWidth = 120
      const gap = 8
      const newIndex = Math.round(scrollPosition / (tabWidth + gap))
      setCurrentIndex(newIndex)

      // Check if we have reached the rightmost position
      const isAtRightmost = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth
      setShowRightButton(!isAtRightmost)
    }
  }

  const maxIndex = Math.max(0, SimulationAnalysisTabs.length - itemsPerView)
  const showLeftButton = currentIndex > 0
  // Set right button visibility based on updateButtonVisibility

  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const tabWidth = 120
      const gap = 8
      const newPosition = index * (tabWidth + gap)
      sliderRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
      setCurrentIndex(index)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        updateButtonVisibility()
      }
    }

    window.addEventListener('resize', handleResize)
    updateButtonVisibility()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="border flex flex-col min-h-[664px] w-full max-lg:max-w-full gap-4 border-[var(--Border-Secondary)] rounded-xl p-5 bg-black text-white">
      <div className="text-xs font-bold tracking-widest text-assessmentTextColor">
        ANALYSIS DASHBOARD
      </div>

      <div className="relative w-full flex items-center">
        {showLeftButton && (
          <button
            onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
            className="absolute left-0 z-10 bg-black border border-gray-700 shadow-xl p-2 rounded-md"
            aria-label="Scroll left"
          >
            <MdOutlineArrowLeft size="1.5em"/>
          </button>
        )}

        <div
          ref={sliderRef}
          className="flex gap-2 overflow-x-auto w-full py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hide-scrollbar"
          role="list"
          onScroll={updateButtonVisibility}
        >
          {SimulationAnalysisTabs.map((item, index) => (
            <div
              key={`tab-${item.label}-${index}`}
              className={`flex w-[120px] text-xs items-center p-3 rounded-md cursor-pointer ${
                activeTab === index
                  ? 'bg-barBgColor text-assessmentTextColor'
                  : 'bg-black text-[var(--Content-Primary-static)]'
              } border border-dashBoardBorderColor`}
              onClick={() => handleSelectTab(index)}
              role="listitem"
            >
              <p className="truncate">{item.label}</p>
            </div>
          ))}
        </div>

        {showRightButton && (
          <button
            onClick={() => scrollToIndex(Math.min(maxIndex, currentIndex + 1))}
            className="absolute right-0 bg-black drop-shadow-xl z-10 border border-gray-700 p-2 rounded-md backdrop-blur-xl"
            
          >
            <MdOutlineArrowRight size="1.5em"/>
          </button>
        )}
      </div>

      {activeTab === 0 && (
        <DashboardTab
          salesTimeRange={salesTimeRange}
          setSalesTimeRange={setSalesTimeRange}
          comparisonTimeRange={comparisonTimeRange}
          setComparisonTimeRange={setComparisonTimeRange}
          salesData={salesData}
          comparisonData={comparisonData}
        />
      )}

      {activeTab === 1 && (
        <MetricsTab metricsData={metricsData} />
      )}
    </div>
  )
}
